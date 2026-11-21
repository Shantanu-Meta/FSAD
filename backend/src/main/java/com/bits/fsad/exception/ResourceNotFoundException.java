package com.bits.fsad.exception;

/** Thrown when an entity cannot be found; mapped to HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
