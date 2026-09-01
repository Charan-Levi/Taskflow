package com.devopspractice.taskmanager.repository;

import com.devopspractice.taskmanager.model.Task;
import com.devopspractice.taskmanager.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findAllByOrderByUpdatedAtDesc();
}
