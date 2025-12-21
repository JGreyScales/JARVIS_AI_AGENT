#include "ImageProcessor.h"

int main() {
    std::cout << "Starting" << std::endl;
    std::string imagePath = "training.jpg";

    ImageProcessor processor(imagePath);

    int faceCount = processor.locateFaces();
    std::cout << "Detected " << faceCount << " faces." << std::endl;
    processor.predictFaces();
    processor.showcasePreview();
    return 0;
}
