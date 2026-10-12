package com.campuspulse.repository;
import com.campuspulse.model.CampusNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CampusNoticeRepository extends JpaRepository<CampusNotice, Long> {
    List<CampusNotice> findByPublishedTrueOrderByPublishedAtDesc();
}
