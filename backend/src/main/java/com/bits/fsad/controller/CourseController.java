package com.bits.fsad.controller;

import com.bits.fsad.entity.Course;
import com.bits.fsad.entity.CourseFee;
import com.bits.fsad.entity.Subject;
import com.bits.fsad.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Courses
    @GetMapping
    public List<Course> list() {
        return courseService.findAll();
    }

    @GetMapping("/{id}")
    public Course get(@PathVariable Long id) {
        return courseService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Course> create(@Valid @RequestBody Course course) {
        return ResponseEntity.ok(courseService.create(course));
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course course) {
        return courseService.update(id, course);
    }

    @PutMapping("/{id}/activate")
    public Course activate(@PathVariable Long id) {
        return courseService.setActive(id, true);
    }

    @PutMapping("/{id}/deactivate")
    public Course deactivate(@PathVariable Long id) {
        return courseService.setActive(id, false);
    }

    // Subjects
    @GetMapping("/{id}/subjects")
    public List<Subject> subjects(@PathVariable Long id) {
        return courseService.findSubjects(id);
    }

    @PostMapping("/{id}/subjects")
    public Subject addSubject(@PathVariable Long id, @RequestBody Subject subject) {
        return courseService.addSubject(id, subject);
    }

    @DeleteMapping("/subjects/{subjectId}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long subjectId) {
        courseService.deleteSubject(subjectId);
        return ResponseEntity.noContent().build();
    }

    // Fees
    @GetMapping("/{id}/fees")
    public List<CourseFee> fees(@PathVariable Long id) {
        return courseService.findFees(id);
    }

    @PostMapping("/{id}/fees")
    public CourseFee addFee(@PathVariable Long id, @RequestBody CourseFee fee) {
        return courseService.addFee(id, fee);
    }

    @PutMapping("/fees/{feeId}")
    public CourseFee updateFee(@PathVariable Long feeId, @RequestBody CourseFee fee) {
        return courseService.updateFee(feeId, fee);
    }

    @DeleteMapping("/fees/{feeId}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long feeId) {
        courseService.deleteFee(feeId);
        return ResponseEntity.noContent().build();
    }
}
