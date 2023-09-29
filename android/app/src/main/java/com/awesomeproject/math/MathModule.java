package com.awesomeproject.math;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MathModule extends ReactContextBaseJavaModule {

    public MathModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "MyMathModule";
    }

    @ReactMethod
    public void sum(int a, int b, Promise p) {
        p.resolve(a+b);
    }
}
