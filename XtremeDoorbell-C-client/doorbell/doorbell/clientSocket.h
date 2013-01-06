//
//  clientSocket.h
//  doorbell
//
//  Created by Allan Baril on 18-12-12.
//  Copyright (c) 2012 Allan Baril. All rights reserved.
//

#ifndef doorbell_clientSocket_h
#define doorbell_clientSocket_h

int connectToServer(const char *domainName, int port);
bool dataAvailable(const int socketHandle, const int timeoutSec);
bool socketConnected(const int socketHandle);
ssize_t receiveData(const int socketHandle, char *buffer, int bufferLength);
bool sendData(const int socketHandle, const char *buffer, int bufferLength);
bool determineLocalAddress(const int socketHandle, char *localAddress, int localAddressLength);

#endif
