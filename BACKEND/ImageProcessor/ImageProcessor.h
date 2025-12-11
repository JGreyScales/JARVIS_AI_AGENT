#ifndef IMAGESPROCESSOR_H
#define IMAGESPROCESSOR_H

#include <opencv2/opencv.hpp>
#include <string>
#include <vector>
#include <iostream>
#include <cmath>

#include "FaceRecongizer.h"

#define faceFrontalModelPath "TrainingData/frontFaceData.xml"

class ImageProcessor
{
private:
    cv::Mat frame;
    cv::Mat greyscaleFrame;
    bool frameLoad;
    std::vector<cv::Rect> faces;
    cv::CascadeClassifier faceFrontal;
    FaceRecongizer face;

public:
    // Constructor declaration
    ImageProcessor(std::string imagePath) : face() // cosntruct face in place to prevent dupe creation
    {
        this->faceFrontal.load(faceFrontalModelPath);



        this->frame = cv::imread(imagePath, cv::IMREAD_UNCHANGED);
        this->frameLoad = !this->frame.empty();
        if (!frameLoad) {
            std::cerr << "Error: Could not load image: " << imagePath << std::endl;
            return;
        }
    }

    // locateFaces declaration
    int locateFaces() {
        cv::cvtColor(this->frame, this->greyscaleFrame, cv::COLOR_BGR2GRAY);
        double sizeReducationPerSweep = 1.33;
        int requiredPositivesForObject = 4;
        this->faceFrontal.detectMultiScale(this->greyscaleFrame, this->faces, sizeReducationPerSweep, requiredPositivesForObject);
        return this->faces.size();
    }

    void predictFaces(){
        this->face.predictFace(&this->greyscaleFrame, &this->faces);
        return;
    }

    void showcasePreview(){
        cv::Mat showcaseFrame = this->frame;
        cv::resize(showcaseFrame, showcaseFrame, cv::Size(700, 700));
        float scaleX = 700.0f / this->frame.cols;
        float scaleY = 700.0f / this->frame.rows;
        for (size_t i = 0; i < this->faces.size(); i++){
            cv::Rect scaledFace(
                this->faces[i].x * scaleX,
                this->faces[i].y * scaleY,
                this->faces[i].width * scaleX,
                this->faces[i].height * scaleY
            );

            cv::rectangle(showcaseFrame, scaledFace, cv::Scalar(0, 255, 0), 2);

            std::string text = std::to_string(this->face.predictedLabels[i]);
            cv::putText(showcaseFrame, text, cv::Point(scaledFace.x, scaledFace.y - 5), cv::FONT_HERSHEY_SIMPLEX, 0.7, cv::Scalar(0, 255, 0), 2);
        }
        cv::imshow("Showcase Preview", showcaseFrame);
        cv::waitKey(0);
    }

    // Destructor declaration
    ~ImageProcessor() {

    }
};

#endif // IMAGESPROCESSOR_H