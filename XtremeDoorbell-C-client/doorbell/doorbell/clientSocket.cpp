//
//  clientSocket.c
//  doorbell
//
//  Created by Allan Baril on 18-12-12.
//  Copyright (c) 2012 Allan Baril. All rights reserved.
//

#include <iostream>
#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <strings.h>
#include <string.h>

int connectToServer(const char *domainName, int port)
{
    struct sockaddr_in address;
    struct hostent *server;
    int socketHandle;
    
    socketHandle = socket(AF_INET, SOCK_STREAM, 0);
    if (socket < 0) {
        std::cerr << "Unable to open socket" << std::endl;
        return -1;
    }
    
    server = gethostbyname(domainName);
    if (server == NULL) {
        std::cerr << "Failed to resolve server" << std::endl;
        return -1;
    }
    
    bzero((char *) &address, sizeof(address));
    address.sin_family = AF_INET;
    bcopy((char *)server->h_addr, (char *)&address.sin_addr.s_addr, server->h_length);
    address.sin_port = htons(port);
    
    if (connect(socketHandle, (struct sockaddr *)&address, sizeof(address)) < 0) {
        std::cerr << "Unable to connect to server" << std::endl;
        return -1;
    }
    
    std::cout << "Connected to server: " << domainName << std::endl;
    return socketHandle;
}

bool dataAvailable(const int socketHandle, const int timeoutSec)
{
    fd_set fds;
    struct timeval timeout;
    int rc;
    
    timeout.tv_sec = timeoutSec;
    timeout.tv_usec = 0;

    FD_ZERO(&fds);
    FD_SET(socketHandle, &fds);
    rc = select(sizeof(fds)*8, &fds, NULL, NULL, &timeout);
    if (rc < 0) {
        std::cerr << "Select failed" << std::endl;
        return false;
    }
    
    return FD_ISSET(socketHandle, &fds);
}

bool socketConnected(const int socketHandle)
{
    int error = 0;
    socklen_t len = sizeof (error);
    
    if (socketHandle < 0) {
        return false;
    }
    return (getsockopt(socketHandle, SOL_SOCKET, SO_ERROR, &error, &len) == 0);
}

ssize_t receiveData(const int socketHandle, char *buffer, int bufferLength)
{
    ssize_t length = recv(socketHandle, buffer, bufferLength, MSG_DONTWAIT);
    if (length > 0) {
        buffer[length] = 0;
    }
    return length;
    
}

bool sendData(const int socketHandle, const char *buffer, int bufferLength)
{
    return (send(socketHandle, buffer, bufferLength, 0) == bufferLength);
}

bool determineLocalAddress(const int socketHandle, char *localAddress, int localAddressLength)
{
    struct sockaddr_in sockaddr;
    socklen_t sockaddrLength = sizeof(sockaddr);
    
    if (getsockname(socketHandle, (struct sockaddr *)&sockaddr, &sockaddrLength) == -1) {
        return false;
    }
    strncpy(localAddress, inet_ntoa(sockaddr.sin_addr), localAddressLength);
    return true;
}

