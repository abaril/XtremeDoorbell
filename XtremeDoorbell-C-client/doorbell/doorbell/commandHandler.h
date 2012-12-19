//
//  commandHandler.h
//  doorbell
//
//  Created by Allan Baril on 18-12-12.
//  Copyright (c) 2012 Allan Baril. All rights reserved.
//

#ifndef __doorbell__commandHandler__
#define __doorbell__commandHandler__

#include <iostream>

void handleCommand(int socketHandle, const char *commandBuffer, ssize_t commandLength);

#endif /* defined(__doorbell__commandHandler__) */
