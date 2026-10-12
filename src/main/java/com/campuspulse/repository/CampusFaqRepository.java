package com.campuspulse.repository;
import com.campuspulse.model.CampusFaq;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CampusFaqRepository extends JpaRepository<CampusFaq, Long> {
    List<CampusFaq> findByPublishedTrueOrderByCategoryAscQuestionAsc();
}
