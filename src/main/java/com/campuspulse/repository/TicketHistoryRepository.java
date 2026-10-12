package com.campuspulse.repository;
import com.campuspulse.model.TicketHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {
    List<TicketHistory> findByTicket_IdOrderByCreatedAtDesc(Long ticketId);
}
