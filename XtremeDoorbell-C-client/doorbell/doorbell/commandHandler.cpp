//
//  commandHandler.cpp
//  doorbell
//
//  Created by Allan Baril on 18-12-12.
//  Copyright (c) 2012 Allan Baril. All rights reserved.
//

#include <unistd.h>
#include "commandHandler.h"
#include "clientSocket.h"
#include "settings.h"

void sendStatus(int socketHandle)
{
    char response[512];
    int length;
    
    length = snprintf(response, sizeof(response),
                      "{\"name\":\"%s\",\"status\":\"idle\"}",
                      NODE_NAME);
    sendData(socketHandle, response, length);
}

void playMusic(const char *commandBuffer)
{
    char musicUrl[512];
    char command[512];
    
    const char *name = strstr(commandBuffer, "\"url\"");
    if (name != NULL) {
        name += 7;
        strncpy(musicUrl, name, sizeof(musicUrl));
        char *end = strstr(musicUrl, "\"");
        if (end != NULL) {
            *end = 0;
        }
        
        std::cout << "Play music at: " << musicUrl << std::endl;
        snprintf(command, sizeof(command), "%s %s", MUSIC_COMMAND, musicUrl);
        system(command);
    }
}

void handleCommand(int socketHandle, const char *commandBuffer, ssize_t commandLength)
{
    // this is lazy, but ...
    if (strstr(commandBuffer, "\"status\"") != NULL) {
        sendStatus(socketHandle);
    }
    else if (strstr(commandBuffer, "\"play\"") != NULL) {
        playMusic(commandBuffer);
    }
}
