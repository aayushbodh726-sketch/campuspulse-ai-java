package com.campuspulse.controller;

import com.campuspulse.model.AppUser;
import com.campuspulse.model.Department;
import com.campuspulse.model.UserRole;
import com.campuspulse.repository.AppUserRepository;
import com.campuspulse.repository.DepartmentRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final AppUserRepository users;
    private final DepartmentRepository departments;
    public AdminController(AppUserRepository users, DepartmentRepository departments) { this.users=users; this.departments=departments; }

    @GetMapping("/users")
    public String users(Model model) {
        model.addAttribute("users", users.findAll().stream().sorted(java.util.Comparator.comparing(AppUser::getCreatedAt).reversed()).toList());
        model.addAttribute("departments", departments.findAll());
        model.addAttribute("roles", UserRole.values());
        return "admin-users";
    }

    @PostMapping("/users/{id}/role")
    public String updateRole(@PathVariable Long id, @RequestParam UserRole role, @RequestParam(required=false) Long departmentId,
                             RedirectAttributes redirect) {
        AppUser user = users.findById(id).orElse(null);
        if (user == null) { redirect.addFlashAttribute("errorMessage", "User was not found."); return "redirect:/admin/users"; }
        if (role == UserRole.STAFF && departmentId == null) { redirect.addFlashAttribute("errorMessage", "Staff users need a department."); return "redirect:/admin/users"; }
        Department department = null;
        if (departmentId != null) {
            department = departments.findById(departmentId).orElse(null);
            if (department == null) { redirect.addFlashAttribute("errorMessage", "Choose a valid department."); return "redirect:/admin/users"; }
        }
        user.setRole(role); user.setDepartment(department); users.save(user);
        redirect.addFlashAttribute("successMessage", "Updated access for " + user.getEmail() + ".");
        return "redirect:/admin/users";
    }
}
