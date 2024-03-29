// WinSyncExec.cpp : Defines the exported functions for the DLL application.
//

#include "stdafx.h"

#include <windows.h>
#include <stdio.h>
#include <tchar.h>


extern "C" {
  __declspec( dllexport ) int WinExecSync( LPSTR cmd, LPSTR dir )
  {
      SetCurrentDirectory(dir);

      STARTUPINFO si;
      PROCESS_INFORMATION pi;

      ZeroMemory( &si, sizeof(si) );
      si.cb = sizeof(si);
      ZeroMemory( &pi, sizeof(pi) );

      // Start the child process. 
      if( !CreateProcess( NULL,   // No module name (use command line)
          cmd,        // Command line
          NULL,           // Process handle not inheritable
          NULL,           // Thread handle not inheritable
          FALSE,          // Set handle inheritance to FALSE
          0,              // No creation flags
          NULL,           // Use parent's environment block
          NULL,           // Use parent's starting directory 
          &si,            // Pointer to STARTUPINFO structure
          &pi )           // Pointer to PROCESS_INFORMATION structure
      ) 
      {
          //printf( "CreateProcess failed (%d).\n", GetLastError() );
          return GetLastError();
      }

      // Wait until child process exits.
      WaitForSingleObject( pi.hProcess, INFINITE );

      // Close process and thread handles. 
      CloseHandle( pi.hProcess );
      CloseHandle( pi.hThread );

      return 0;
  }
}