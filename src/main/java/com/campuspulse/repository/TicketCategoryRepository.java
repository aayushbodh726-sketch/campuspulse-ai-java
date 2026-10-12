package com.campuspulse.repository;
import com.campuspulse.model.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
    List<TicketCategory> findByActiveTrueOrderByNameAsc();
    Optional<TicketCategory> findBySlug(String slug);
}
