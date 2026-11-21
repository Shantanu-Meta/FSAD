package com.bits.fsad.service;

import com.bits.fsad.entity.Course;
import com.bits.fsad.entity.CourseFee;
import com.bits.fsad.entity.Subject;
import com.bits.fsad.exception.BusinessException;
import com.bits.fsad.exception.ResourceNotFoundException;
import com.bits.fsad.repository.CourseFeeRepository;
import com.bits.fsad.repository.CourseRepository;
import com.bits.fsad.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final CourseFeeRepository courseFeeRepository;

    public CourseService(CourseRepository courseRepository,
                         SubjectRepository subjectRepository,
                         CourseFeeRepository courseFeeRepository) {
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.courseFeeRepository = courseFeeRepository;
    }

    // ---- Courses ----
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    public Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));
    }

    @Transactional
    public Course create(Course course) {
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new BusinessException("Course code already exists: " + course.getCourseCode());
        }
        if (course.getAvailableSeats() == null) {
            course.setAvailableSeats(course.getTotalSeats());
        }
        return courseRepository.save(course);
    }

    @Transactional
    public Course update(Long id, Course data) {
        Course c = findById(id);
        c.setCourseName(data.getCourseName());
        c.setDurationYears(data.getDurationYears());
        c.setEligibilityCriteria(data.getEligibilityCriteria());
        // Adjust available seats consistently when total changes.
        if (data.getTotalSeats() != null && !data.getTotalSeats().equals(c.getTotalSeats())) {
            int used = c.getTotalSeats() - c.getAvailableSeats();
            if (data.getTotalSeats() < used) {
                throw new BusinessException("Total seats cannot be less than already-filled seats (" + used + ")");
            }
            c.setTotalSeats(data.getTotalSeats());
            c.setAvailableSeats(data.getTotalSeats() - used);
        }
        if (data.getIsActive() != null) {
            c.setIsActive(data.getIsActive());
        }
        return courseRepository.save(c);
    }

    @Transactional
    public Course setActive(Long id, boolean active) {
        Course c = findById(id);
        c.setIsActive(active);
        return courseRepository.save(c);
    }

    // ---- Subjects ----
    public List<Subject> findSubjects(Long courseId) {
        findById(courseId);
        return subjectRepository.findByCourseIdOrderBySemesterAsc(courseId);
    }

    @Transactional
    public Subject addSubject(Long courseId, Subject subject) {
        findById(courseId);
        if (subjectRepository.existsByCourseIdAndSubjectCode(courseId, subject.getSubjectCode())) {
            throw new BusinessException("Subject code already exists for this course: " + subject.getSubjectCode());
        }
        subject.setCourseId(courseId);
        return subjectRepository.save(subject);
    }

    @Transactional
    public void deleteSubject(Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new ResourceNotFoundException("Subject not found: " + subjectId);
        }
        subjectRepository.deleteById(subjectId);
    }

    // ---- Fees ----
    public List<CourseFee> findFees(Long courseId) {
        findById(courseId);
        return courseFeeRepository.findByCourseId(courseId);
    }

    @Transactional
    public CourseFee addFee(Long courseId, CourseFee fee) {
        findById(courseId);
        fee.setCourseId(courseId);
        return courseFeeRepository.save(fee);
    }

    @Transactional
    public CourseFee updateFee(Long feeId, CourseFee data) {
        CourseFee fee = courseFeeRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee not found: " + feeId));
        fee.setFeeType(data.getFeeType());
        fee.setAmount(data.getAmount());
        fee.setAcademicYear(data.getAcademicYear());
        return courseFeeRepository.save(fee);
    }

    @Transactional
    public void deleteFee(Long feeId) {
        if (!courseFeeRepository.existsById(feeId)) {
            throw new ResourceNotFoundException("Fee not found: " + feeId);
        }
        courseFeeRepository.deleteById(feeId);
    }
}
