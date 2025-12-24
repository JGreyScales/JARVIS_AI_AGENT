#ifndef FACE_RECOGNIZER_H
#define FACE_RECOGNIZER_H

#include "magicNums.h"

#include <opencv2/opencv.hpp>
#include <opencv2/face.hpp>
#include <filesystem>
#include <iostream>
#include <chrono>

#define DATASETPATH "TrainingData"
#define MODELSPATH "models"
#define DEFAULTMODEL "userModel.xml"

class FaceRecongizer
{
private:
    cv::Ptr<cv::face::LBPHFaceRecognizer> model;
    int thresholdMax = 175.0;
    int thresholdMin = this->thresholdMax * 0.80 ;


    void createModel(){
        double backgroundGrabRadius = 1.0;
        int matchingNeighborsRequired = 14;
        int resolution = 8;

        std::cout << "Model created with following params:\n    ";
        std::cout << "Background Noise Grab Radius: " << backgroundGrabRadius << "\n    "; 
        std::cout << "Matching Neighbors Required: " << matchingNeighborsRequired << "\n    "; 
        std::cout << "Face Resolution: " << resolution << "x" << resolution << "\n    "; 
        std::cout << "Rejection Threshold (MAX): " << thresholdMax << "\n    ";
        std::cout << "Rejection Threshold (MIN): " << thresholdMin << std::endl;

        this->model = cv::face::LBPHFaceRecognizer::create(backgroundGrabRadius, matchingNeighborsRequired, resolution, resolution, thresholdMax);
    }

    void modelTrain(){
        int ticker = 0;
        int fileTicker = 0;
        std::chrono::_V2::system_clock::time_point start = std::chrono::high_resolution_clock::now();
        std::filesystem::directory_iterator trainingData = std::filesystem::directory_iterator(DATASETPATH);
        for (std::filesystem::__cxx11::directory_entry user : trainingData){
            int imagesPerUser = 0;
            if (!user.is_directory()) {continue;}
            ticker++;

            for (std::filesystem::__cxx11::directory_entry image : std::filesystem::directory_iterator(user.path())){

                fileTicker++;
                imagesPerUser++;

                if (imagesPerUser > 20){
                    break;
                }

                cv::Mat img = cv::imread(image.path().string(), cv::IMREAD_REDUCED_GRAYSCALE_2);

                if (img.empty()){continue;}

                cv::resize(img, img, cv::Size(120, 120));
                this->model->update(std::vector<cv::Mat>{img}, std::vector<int>{ticker});
                img.release();
            }
            std::cout << "User: " << user.path().filename().string() << " has " << imagesPerUser << " Images" << std::endl;
        }

        std::cout << "Processed: " << ticker << " users and: " << fileTicker << " images" << std::endl;

        std::string modelName = DEFAULTMODEL;
        std::cout << "Saving file: " << modelName << std::endl;
        this->model->save((std::filesystem::path(MODELSPATH) / modelName).string());


        std::chrono::_V2::system_clock::time_point stop = std::chrono::high_resolution_clock::now();
        std::chrono::__enable_if_is_duration<std::chrono::milliseconds> delta = std::chrono::duration_cast<std::chrono::milliseconds>(stop - start);
        std::cout << "Time taken for all steps: " << delta.count() << " ms" << std::endl;
    }

    void loadModel(){
        std::chrono::_V2::system_clock::time_point start = std::chrono::high_resolution_clock::now();
        std::cout << "Loading face model" << std::endl;
        std::filesystem::path modelPath = (std::filesystem::path(MODELSPATH) / DEFAULTMODEL);

        if (!std::filesystem::exists(modelPath)){
            std::cout <<"Model does not exist, creating one" << std::endl;
            this->modelTrain();
            return;
        }

        // system time stuff
        std::filesystem::file_time_type ftime = std::filesystem::last_write_time(modelPath);
        std::__enable_if_t<true, std::chrono::time_point<std::chrono::_V2::system_clock, std::chrono::_V2::system_clock::duration>> sctp = 
            std::chrono::time_point_cast<std::chrono::system_clock::duration>( ftime - std::filesystem::file_time_type::clock::now() + std::chrono::system_clock::now());

        std::time_t lastWriteTime = std::chrono::system_clock::to_time_t(sctp);

        std::cout << "Model was trained at: " << std::asctime(std::localtime(&lastWriteTime));

        std::chrono::_V2::system_clock::time_point now = std::chrono::system_clock::now();        
        std::chrono::duration<long long, std::nano> diff = now - sctp;
        std::chrono::hours threshold = std::chrono::hours(24);

        if (diff > threshold){
            std::cout << "Model was created too long ago, recreating the model" << std::endl;
            this->modelTrain();
            return;
        }

        std::cout << "loading model from path" << std::endl;
        this->model->read(modelPath.string());
        std::cout << "Model loaded" << std::endl;
        std::chrono::_V2::system_clock::time_point stop = std::chrono::high_resolution_clock::now();
        std::chrono::__enable_if_is_duration<std::chrono::milliseconds> delta = std::chrono::duration_cast<std::chrono::milliseconds>(stop - start);
        std::cout << "Time taken for all steps: " << delta.count() << " ms" << std::endl;
    }
public:

    std::vector<int> predictedLabels;
    std::vector<double> confidences;

    // Constructor
    FaceRecongizer(){
        this->createModel();
        this->loadModel();
    }

    void predictFace(cv::Mat* mask, std::vector<cv::Rect>* faces){
        predictedLabels.clear();
        confidences.clear();
        if (!mask || mask->empty() || !model || !faces){
            std::cout << "One or more required variables are undefined or empty" << std::endl;
        }
        std::list<std::string> labels;
        for (size_t i = 0; i < faces->size(); i++){
            std::cout << "Predicting face: " << i + 1 << "/" << faces->size();
            int predictedLabel = -1;
            double confidence = 0.0;
            // get region of interest of each face and ensure its in the pixel bounds of the mask
            cv::Rect validRect = (*faces)[i] & cv::Rect(0, 0, mask->cols, mask->rows);
            cv::Mat faceROI = (*mask)(validRect);
            cv::imshow("x", faceROI);

            model->predict(faceROI, predictedLabel, confidence);
            confidence = std::floor(confidence);

            if (predictedLabel == -1){
                std::cout << " Rejected by threshold (above maximum) ";
                confidence = this->model->getThreshold() + 1;
            }

            if (confidence <= thresholdMin){
                std::cout << " Rejected by threshold (below minimum) ";
                predictedLabel = -1;
            }

            
            this->predictedLabels.push_back(predictedLabel);
            this->confidences.push_back(confidence);
            std::cout << " userID: " << predictedLabel;
            std::cout << " confidence: " << confidence << "/" << this->model->getThreshold() << std::endl;
        }
        return;
    }

    // Destructor
    ~FaceRecongizer(){
    }

};

#endif
