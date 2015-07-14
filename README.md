# node-time-server

## Description
A small node.js time server, that tells the time upon a request, sets the time zone upon request and provides a time polling mechanism.

## HTTP API
#### #GET /time  
Get the current time.  
If no _timezone_ parameter has been given, the time zone to be used is the _global time zone_ set by the [POST /timezone](#post-timezone) request. 

The default _global time zone_ (in case it was not set) is the local time zone.

**_Parameters_**:  
(optional) timezone - the time zone to use.  
  
**_Response_**:  
A json with the following fields:  
time - the current time.  
timezone - the time zone.  

Request example:  
```GET /time?timezone=+02```
  
Response example: 
```
{
  time: 14:23:00-19/3/2007,
  timezone: +02
}
```

#### #POST /timezone
Set the global time zone to be used in the response for the [GET /time](#get-time) request.

**_Parameters_**:  
timezone - the time zone to use.  
The parameter should be sent as json.  
Time zone notation - you can use whatever notation you wish.  
A simple way to go would be to use [UTC offsets](http://en.wikipedia.org/wiki/UTC_offset), e.g +01, +10, -08 etc.
  
Request example: 
```
POST /timezone
body: 
{
  timezone: -11
}
```

## Websocket API
#### setTimezone message
Set the time zone for the updates sent to the client who sent this message.

**_Action_**:  
setTimezone

**_Parameters_**:  
timezone - the time zone to use.  
For description, see _timezone_ param in [POST /timezone](#post-timezone).

example: 
```
{
  action: 'setTimezone',
  timezone: -11
}
```

## Examples

**Request:**  
```GET /time```  

**Response:** 
```
{
  time: 12:20:00-27/5/2015,
  timezone: +01
}
```

**Request:**  
```GET /time?timezone=+03```  

**Response:** 
```
{
  time: 14:20:00-27/5/2015,
  timezone: +03
}
```

**Request:**  
```
POST /timezone
body: { timezone : -02 }
```

**Response:** 
```
200
```

**Request:**  
```GET /time (after previous POST request)```  

**Response:** 
```
{
  time: 09:20:00-27/5/2015,
  timezone: -02
}
```

