#include "FaceRecongizer.h"

#include <vector>
#include <cstdio>
#include <regex>

class landmark
{
public:
    double x;
    double y;
    double z;
    bool error = false;
    std::string name;
    landmark(std::string rawData, size_t index);
};

landmark::landmark(std::string rawData, size_t index)
{
    size_t x_pos = rawData.find("x=") + 2;
    size_t y_pos = rawData.find("y=") + 2;
    size_t z_pos = rawData.find("z=") + 2;

    std::string x_str = rawData.substr(x_pos, rawData.find(",", x_pos) - x_pos);
    std::string y_str = rawData.substr(y_pos, rawData.find(",", y_pos) - y_pos);
    std::string z_str = rawData.substr(z_pos, rawData.find(",", z_pos) - z_pos);

    this->x = std::stod(x_str);
    this->y = std::stod(y_str);
    this->z = std::stod(z_str);

    switch (index)
    {
    case 0:
        this->name = "Wrist";
        break;
    case 1:
        this->name = "Thumb Carpometacarpal Joint";
        break;
    case 2:
        this->name = "Thumb Metacarpophalangeal Joint";
        break;
    case 3:
        this->name = "Thumb Interphalangeal Joint";
        break;
    case 4:
        this->name = "Thumb Tip";
        break;
    case 5:
        this->name = "Index Finger Metacarpophalangeal Joint";
        break;
    case 6:
        this->name = "Index Finger Proximal Interphalangeal Joint";
        break;
    case 7:
        this->name = "Index Finger Distal Interphalangeal Joint";
        break;
    case 8:
        this->name = "Index Finger Tip";
        break;
    case 9:
        this->name = "Middle Finger Metacarpophalangeal Joint";
        break;
    case 10:
        this->name = "Middle Finger Proximal Interphalangeal Joint";
        break;
    case 11:
        this->name = "Middle Finger Distal Interphalangeal Joint";
        break;
    case 12:
        this->name = "Middle Finger Tip";
        break;
    case 13:
        this->name = "Ring Finger Metacarpophalangeal Joint";
        break;
    case 14:
        this->name = "Ring Finger Proximal Interphalangeal Joint";
        break;
    case 15:
        this->name = "Ring Finger Distal Interphalangeal Joint";
        break;
    case 16:
        this->name = "Ring Finger Tip";
        break;
    case 17:
        this->name = "Pinky Metacarpophalangeal Joint";
        break;
    case 18:
        this->name = "Pinky Proximal Interphalangeal Joint";
        break;
    case 19:
        this->name = "Pinky Distal Interphalangeal Joint";
        break;
    case 20:
        this->name = "Pinky Tip";
        break;
    default:
        this->name = "Unknown";
        break;
    }
}

std::string operator+(const std::string& lhs, const landmark& rhs)
{
    return lhs + " " + rhs.name + ": x=" + std::to_string(rhs.x) +
           " y=" + std::to_string(rhs.y) +
           " z=" + std::to_string(rhs.z);
}

std::ostream& operator<<(std::ostream& lhs, const landmark& rhs) {
    lhs << rhs.name << ": x=" << rhs.x << " y=" << rhs.y << " z=" << rhs.z;
    return lhs;
}

class handLandmarks
{
private:
    std::string path;
    std::string pythonPath;
    std::string hlStdout;

public:
    std::vector<landmark> keyPoints;
    bool error = false;

    handLandmarks(std::string pythonExecutor, std::string path);
    statusCodes runScript();
    statusCodes extractData();
    ~handLandmarks();
};

handLandmarks::handLandmarks(std::string pythonExecutor, std::string path)
{
    this->pythonPath = pythonExecutor;
    this->path = path;

    if (statusCodes::failure == runScript())
    {
        this->error = true;
        return;
    }

    if (statusCodes::failure == extractData())
    {
        this->error = true;
        return;
    }

    this->error = false;
    return;
}

statusCodes handLandmarks::runScript()
{
    char buffer[256];
    // todo: make the command directory aware to allow the user to execute from any nested directory
    std::string command = this->pythonPath + " " + handLandmarksScriptName + " " + this->path;
    const char *c_command = command.c_str();

    std::cout << "Executing: " << command << std::endl;
    std::FILE *pipe = _popen(c_command, "r");
    if (!pipe)
    {
        std::cout << "Failed to open script pipe" << std::endl;
        return statusCodes::failure;
    }

    while (fgets(buffer, sizeof(buffer), pipe))
    {
        this->hlStdout += buffer;
    }

    _pclose(pipe);
    std::cout << "pipe stopped sending data or closed, processing data in handLandmarks.h" << std::endl;
    return statusCodes::success;
}

statusCodes handLandmarks::extractData()
{
    std::regex landmarkRegex(R"(Landmark\([^)]*\))");
    size_t count = 0;

    std::__cxx11::sregex_iterator beginning = std::sregex_iterator(this->hlStdout.begin(), this->hlStdout.end(), landmarkRegex);
    std::__cxx11::sregex_iterator ending = std::sregex_iterator();

    for (std::__cxx11::sregex_iterator it = beginning; it != ending; ++it)
    {
        this->keyPoints.push_back(landmark(it->str(), count));
        count++;
    }
    return statusCodes::success;
}

handLandmarks::~handLandmarks()
{
}
