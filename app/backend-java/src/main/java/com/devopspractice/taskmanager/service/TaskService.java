package com.devopspractice.taskmanager.service;

import com.devopspractice.taskmanager.dto.TaskInputDto;
import com.devopspractice.taskmanager.dto.TaskResponseDto;
import com.devopspractice.taskmanager.exception.ResourceNotFoundException;
import com.devopspractice.taskmanager.model.Task;
import com.devopspractice.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public List<TaskResponseDto> list() {
        return taskRepository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponseDto get(Long id) {
        return taskRepository.findById(id)
                .map(TaskResponseDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    public TaskResponseDto create(TaskInputDto dto) {
        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .priority(dto.getPriority())
                .build();
        return TaskResponseDto.fromEntity(taskRepository.save(task));
    }

    public TaskResponseDto update(Long id, TaskInputDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        return TaskResponseDto.fromEntity(taskRepository.save(task));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }
}
