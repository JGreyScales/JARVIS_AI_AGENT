#include "ImageProcessor.h"

int main() {
    std::string imagePath = "lenna.jpg";

    ImageProcessor processor(imagePath);

    int faceCount = processor.locateFaces();
    std::cout << "Detected " << faceCount << " faces." << std::endl;
    processor.predictFaces();
    processor.showcasePreview();
    return 0;
}
