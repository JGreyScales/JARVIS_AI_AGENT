#ifndef FACE_RECOGNIZER_H
#define FACE_RECOGNIZER_H

#include <opencv2/opencv.hpp>

class FaceRecongizer
{
private:
    cv::Ptr<cv::face::LBPHFFaceRecognizer> recognizer;
public:
    // Constructor
    FaceRecongizer();

    // Destructor
    ~FaceRecongizer();

};

#endif
