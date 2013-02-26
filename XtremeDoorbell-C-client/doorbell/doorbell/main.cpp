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
            int available = dataAvailable(socketHandle, 30);
            if (available > 0) {
                commandLength = receiveData(socketHandle, commandBuffer, sizeof(commandBuffer));
                if (commandLength > 0) {
                    std::cout << "Received: " <<  commandBuffer << std::endl;
                    handleCommand(socketHandle, commandBuffer, commandLength);
                }
            }
            else if (available < 0) {
                // socket must have broke, let's close and re-attempt
                close(socketHandle);
                socketHandle = -1;
            }
        }
        else {
            sleep(20);
        }
    }
    
    return 0;
}

