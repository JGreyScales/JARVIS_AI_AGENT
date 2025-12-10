#include <opencv2/opencv.hpp>
#include <opencv2/face.hpp>  // For face module (if installed)

int main() {
    // Load an image
    cv::Mat image = cv::imread("lenna.jpg");
    if (image.empty()) {
        std::cerr << "Error: Could not load image 'lenna.jpg'" << std::endl;
        return -1;
    }

    // Display the image
    cv::imshow("Test Image", image);

    // Wait for a key press
    cv::waitKey(0);

    // Example: create a face recognizer (just to test linking)
    cv::Ptr<cv::face::FaceRecognizer> recognizer = cv::face::LBPHFaceRecognizer::create();
    std::cout << "Face module linked successfully!" << std::endl;

    return 0;
}
