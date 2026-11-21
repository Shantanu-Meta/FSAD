package com.bits.fsad.exception;

/** Thrown for business-rule violations; mapped to HTTP 400. */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
