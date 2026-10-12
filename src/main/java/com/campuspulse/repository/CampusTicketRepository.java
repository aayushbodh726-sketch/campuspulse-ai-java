package com.campuspulse.repository;
import com.campuspulse.model.CampusTicket;
import com.campuspulse.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
public interface CampusTicketRepository extends JpaRepository<CampusTicket, Long> {
    List<CampusTicket> findAllByOrderByCreatedAtDesc();
    List<CampusTicket> findByRequester_IdOrderByCreatedAtDesc(Long requesterId);
    List<CampusTicket> findByDepartment_IdOrderByCreatedAtDesc(Long departmentId);
    List<CampusTicket> findByAssignedStaff_IdOrderByCreatedAtDesc(Long staffId);
    long countByStatusNotIn(Collection<TicketStatus> statuses);
}
