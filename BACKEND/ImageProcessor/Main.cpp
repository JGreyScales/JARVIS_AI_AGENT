#include "ImageProcessor.h"

int main() {
    std::cout << "Starting" << std::endl;
    // std::string imagePath = "training.jpg";

    // ImageProcessor processor(imagePath);

    // int faceCount = processor.locateFaces();
    // std::cout << "Detected " << faceCount << " faces." << std::endl;
    // processor.predictFaces();
    // processor.showcasePreview();

    handLandmarks x("python", "hand.jpg");

    for (int y = 0; y < x.keyPoints.size(); y++){
        std::cout << x.keyPoints[y] << std::endl;
    }
    return 0;
}
