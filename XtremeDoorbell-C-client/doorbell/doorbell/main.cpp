//
//  main.cpp
//  doorbell
//
//  Created by Allan Baril on 18-12-12.
//  Copyright (c) 2012 Allan Baril. All rights reserved.
//

#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include "clientSocket.h"
#include "commandHandler.h"
#include "settings.h"

int main(int argc, const char * argv[])
{
    char commandBuffer[512];
    ssize_t commandLength;
    int socketHandle = -1;
    
    while (true)
    {
        if (socketHandle < 0) {
            socketHandle = connectToServer(SERVER_ADDRESS, SERVER_PORT);
        }
        
        if (socketConnected(socketHandle)) {
            if (dataAvailable(socketHandle, 30)) {
                commandLength = receiveData(socketHandle, commandBuffer, sizeof(commandBuffer));
                if (commandLength == 0) {
                    // a receive of zero is also an indication of a closed socket (got to love C/C++ sometimes)
                    socketHandle = -1;
                }
                std::cout << "Received: " <<  commandBuffer << std::endl;
                handleCommand(socketHandle, commandBuffer, commandLength);
            }
            else {
                socketHandle = -1;
            }
        }
        else {
            sleep(20);
        }
    }
    
    return 0;
}

