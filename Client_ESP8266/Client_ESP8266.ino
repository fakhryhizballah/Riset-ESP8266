#include "EspMQTTClient.h"
#include <ArduinoJson.h>
#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

EspMQTTClient client(
    "Spairum.NET",
    "123spairum.net",
    "192.168.137.3", // MQTT Broker server ip
    "",       // Can be omitted if not needed
    "",       // Can be omitted if not needed
    "Client",    // Client name that uniquely identify your device
    1883             // The MQTT port, default to 1883. this line can be omitted
);
void setup()
{
  Serial.begin(115200);
  client.enableMQTTPersistence();
  client.setMqttReconnectionAttemptDelay(2000);
  client.enableDebuggingMessages(); // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater();    // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overridded with enableHTTPWebUpdater("user", "password").
  client.enableOTA();               // Enable OTA (Over The Air) updates. Password defaults to MQTTPassword. Port is the default OTA port. Can be overridden with enableOTA("password", port).
  client.setKeepAlive(4);
}
void onConnectionEstablished()
{
  Serial.println("Connected to MQTT broker");
  client.publish("ESP8266/status/online", "Online");
  // client.subscribe("ESP8266/start/#", [](const String &payload, const String &topic)
  client.subscribe("ESP8266/start/#", [](const String &topic, const String &payload)
                   {
    Serial.println(payload);
    Serial.println(topic);
    int iterasi = payload.toInt();
    String id = topic.substring(topic.lastIndexOf("/") + 1);
    ujian(iterasi, id); 
    Serial.println(id); });
}

void loop()
{
  client.loop();
  while (!client.isConnected())
  {
    Serial.println("Connecting to MQTT broker");
    client.loop();
    delay(1000);
  }
}

void ujian(int iterasi, String id)
{
  int x = 0;

  while (x <= iterasi)
  {
    x++;
    Serial.print("Iterasi ke ");
    Serial.println(x);
    long waktu = millis() + 1000;
    int y = 0;
    while (millis() <= waktu)
    {
      client.loop();
      y = y + 1;
      // Serial.println(y);
      client.publish("/query/count/" + String(x) + "/" + id, String(y));
    }
  }
}
