package com.campuspulse.controller;

import com.campuspulse.model.CampusFaq;
import com.campuspulse.repository.CampusFaqRepository;
import com.campuspulse.service.GrokAssistantService;
import com.campuspulse.service.CurrentUserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
public class AssistantController {
    private final GrokAssistantService assistant;
    private final CampusFaqRepository faqs;
    private final CurrentUserService currentUserService;
    public AssistantController(GrokAssistantService assistant, CampusFaqRepository faqs, CurrentUserService currentUserService) {
        this.assistant=assistant; this.faqs=faqs; this.currentUserService=currentUserService;
    }
    @GetMapping("/assistant")
    public String assistantPage(Model model) {
        currentUserService.requireCurrentUser();
        model.addAttribute("question", "");
        model.addAttribute("answer", "Hi! I’m CampusPulse AI. I can explain how to report a campus issue, choose a category, or understand ticket statuses. I only use verified guidance provided to this prototype.");
        return "assistant";
    }
    @PostMapping("/assistant")
    public String ask(@RequestParam(defaultValue = "") String question, Model model) {
        currentUserService.requireCurrentUser();
        String clean = question.trim();
        model.addAttribute("question", clean);
        if (clean.length() < 2 || clean.length() > 1800) {
            model.addAttribute("answer", "Please enter a question between 2 and 1,800 characters.");
            return "assistant";
        }
        List<CampusFaq> context = faqs.findByPublishedTrueOrderByCategoryAscQuestionAsc();
        model.addAttribute("answer", assistant.answer(clean, context));
        return "assistant";
    }
}
