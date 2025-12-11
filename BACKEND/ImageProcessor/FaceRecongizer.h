#ifndef FACE_RECOGNIZER_H
#define FACE_RECOGNIZER_H

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

    void createModel(){
        this->model = cv::face::LBPHFaceRecognizer::create(1.2, 12, 12, 12, 400.0);
    }

    void modelTrain(){

        int ticker = 0;
        int fileTicker = 0;
        std::chrono::_V2::system_clock::time_point start = std::chrono::high_resolution_clock::now();
        std::filesystem::directory_iterator trainingData = std::filesystem::directory_iterator(DATASETPATH);
        for (std::filesystem::__cxx11::directory_entry user : trainingData){
            int imagesPerUser = 0;
            ticker++;
            if (!user.is_directory()) {continue;}
            for (std::filesystem::__cxx11::directory_entry image : std::filesystem::directory_iterator(user.path())){

                fileTicker++;
                imagesPerUser++;

                if (imagesPerUser > 15){
                    break;
                }

                cv::Mat img = cv::imread(image.path().string(), cv::IMREAD_GRAYSCALE);

                if (img.empty()){continue;}

                cv::resize(img, img, cv::Size(64, 64));
                this->model->update(std::vector<cv::Mat>{img}, std::vector<int>{ticker}); // using update to reduce ram usage
                img.release();
            }
            std::cout << "User: " << user.path().filename().string() << " Loaded so far: " << ticker << std::endl;
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
        createModel();
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

            model->predict(faceROI, predictedLabel, confidence);
            this->predictedLabels.push_back(predictedLabel);
            this->confidences.push_back(confidence);

            std::cout << " userID: " << predictedLabel;
            std::cout << " confidence %: " << confidence << std::endl;
        }
        return;
    }

    // Destructor
    ~FaceRecongizer(){
    }

};

#endif
