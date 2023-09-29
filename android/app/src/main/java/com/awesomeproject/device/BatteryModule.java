package com.awesomeproject.device;

import static android.os.BatteryManager.BATTERY_STATUS_CHARGING;
import static android.os.BatteryManager.BATTERY_STATUS_FULL;

import android.app.AlarmManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.os.PowerManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class BatteryModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;
    AlarmManager alarmManager;

    private static final String BATTERY_LEVEL= "batteryLevel";

    public BatteryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
    }

    @Override
    public String getName() {
        return "MyBatteryModule";
    }

    private WritableMap getPowerStateFromIntent (Intent intent) {
        if(intent == null) {
            return null;
        }

        int batteryLevel = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int batteryScale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        int isPlugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
        int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);

        float batteryPercentage = batteryLevel / (float)batteryScale;

        String batteryState = "unknown";

        if(isPlugged == 0) {
            batteryState = "unplugged";
        } else if(status == BATTERY_STATUS_CHARGING) {
            batteryState = "charging";
        } else if(status == BATTERY_STATUS_FULL) {
            batteryState = "full";
        }

        PowerManager powerManager = (PowerManager)getReactApplicationContext().getSystemService(Context.POWER_SERVICE);
        boolean powerSaveMode = powerManager.isPowerSaveMode();

        String LOW_POWER_MODE = "lowPowerMode";
        String BATTERY_STATE = "batteryState";

        WritableMap powerState = Arguments.createMap();
        powerState.putString(BATTERY_STATE, batteryState);
        powerState.putDouble(BATTERY_LEVEL, batteryPercentage);
        powerState.putBoolean(LOW_POWER_MODE, powerSaveMode);

        return powerState;
    }

    public double getBatteryLevelSync() {
        Intent intent = getReactApplicationContext().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        WritableMap powerState = getPowerStateFromIntent(intent);

        if(powerState == null) {
            return 0;
        }

        return powerState.getDouble(BATTERY_LEVEL);
    }

    @ReactMethod
    public void getBatteryLevel(Promise p) {
        p.resolve(getBatteryLevelSync());
    }
}
