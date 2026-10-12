package com.campuspulse.repository;
import com.campuspulse.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findBySlug(String slug);
    Optional<Department> findByName(String name);
}
