package com.campuspulse.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public String forbidden(AccessDeniedException exception, Model model) {
        model.addAttribute("statusCode", 403);
        model.addAttribute("message", "You do not have permission to view this resource.");
        return "error";
    }
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String notFound(NoSuchElementException exception, Model model) {
        model.addAttribute("statusCode", 404);
        model.addAttribute("message", exception.getMessage() == null ? "The requested item was not found." : exception.getMessage());
        return "error";
    }
}
