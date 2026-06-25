---
title: 'What Building a Small RTOS Taught Me About Debugging'
slug: 'what-building-a-small-rtos-taught-me-about-debugging'
summary: "Building a small RTOS on a Cortex-M4 taught me that firmware debugging isn't about finding the wrong line — it's about understanding system behavior over time."
kind: 'article'
date: 2026-06-26
tags: ['rtos', 'debugging', 'firmware', 'embedded', 'cortex-m']
draft: false
---

During my master's program, I took a course called **EE-6314 Real-Time Operating Systems**.

As part of the course, I built a small RTOS in C for the TM4C123GH6PM, an ARM Cortex-M4F microcontroller. It was not a production RTOS. It was a learning project meant to help us understand how an RTOS works under the hood.

The project had a cooperative and preemptive scheduler, priority-based scheduling, round-robin scheduling, semaphores, thread sleep and deletion, system calls, and a UART shell to inspect the system while it was running.

Looking back, it was very much a student project. Most of the implementation lived in one C file. If I were writing it today, I would separate the scheduler, synchronization code, shell, hardware setup, and demo tasks into cleaner modules.

But at the time, keeping everything together also forced me to stay close to the whole system. I had to see how the pieces interacted with each other.

That project was one of the first times I realized something important:

**Embedded debugging is hard because system behavior is hard to observe.**

## When the code runs, but the behavior is wrong

One part of the course was designed to teach us about priority inversion.

Priority inversion happens when a high-priority task is waiting for a resource held by a lower-priority task. If other tasks keep running in between, the high-priority task may not run when we expect it to. Priority inheritance helps by temporarily raising the priority of the task holding the resource.

When this is explained in a diagram, it feels simple.

But when it happens inside your own RTOS, it feels very different.

I remember trying to understand why a high-priority task was not running as often as it should. The system was not completely broken. Tasks were running. The shell was working. Some parts looked correct.

But the timing behavior was wrong.

So I did what many firmware engineers do during debugging.

I stared at logs.
I added more prints.
I checked which function was running.
I looked at timing.
I checked registers.
I ran the same case again.
I doubted the hardware.
Then I doubted my own code.

The hard part was not finding one obvious wrong line.

The hard part was understanding how tasks, priorities, resources, and timing were interacting over time.

That stayed with me.

## Logs help, but they do not show everything

I use logs a lot. Logs are useful. They are often the first thing I check when something fails.

But logs usually show only small parts of the system.

They can tell me what message was printed. They may tell me when it was printed. They may tell me which module printed it.

But many embedded problems need a deeper question:

**What was the system doing before the failure became visible?**

That question is harder to answer.

In embedded systems, failures often come from interactions. A task may miss its timing requirement. A resource may be locked for too long. A queue may slowly fill up. An interrupt may happen more often than expected. A state machine may enter a path that looks valid but still causes bad behavior later.

The visible symptom is not always close to the real cause.

This is why problems like race conditions and priority inversion are difficult. They are not always captured clearly by one log line. They happen because of timing, order, scheduling, and shared resources.

By the time the system fails, the most important part may have already happened.

## Debugging is really about understanding behavior

Over time, my debugging process became more systematic.

First, reproduce the issue. Then isolate the area. Add logs only where needed. Check the hardware. Check timing. Check the state of the system. Check the implementation. Try a known working example if one is available. Compare the differences. Form a hypothesis. Then test it.

This sounds simple when written down.

In practice, it can take time.

That is what I find both frustrating and interesting about embedded debugging. When I do not understand why the system failed, it feels like I am only seeing the tip of the problem. The logs may show me the symptom, but not the full behavior that caused it.

At the same time, I enjoy debugging. It feels like solving a puzzle. When the root cause finally becomes clear, there is a small Eureka moment. The system that looked confusing suddenly starts to make sense.

But the time it takes to reach that point matters.

In real projects, debugging time affects schedules, confidence, and reliability. Some bugs are especially hard because the system may look fine most of the time. Then one timing issue, one ordering issue, or one resource-sharing issue exposes the problem.

That is also why the Mars Pathfinder priority inversion example stayed with me when my professor discussed it. A small scheduling or resource-sharing issue can look harmless at first, but over time it can affect a mission-critical system.

The lesson was not just "use priority inheritance."

The bigger lesson was that system behavior matters.

## What I started thinking about

That RTOS project changed how I think about firmware debugging.

Earlier, I thought of debugging mostly as finding the wrong line of code.

Now I think of it more as understanding system behavior.

What was running?
What was blocked?
Which resource was held?
Which task was waiting?
What happened before the symptom?
What changed over time?
Which assumption was wrong?

These questions are not always easy to answer from normal logs.

This is the area I have been thinking about more recently: how firmware behavior can be made easier to observe and understand.

I am interested in looking at embedded systems through behavior over time: tasks, events, resources, memory, timing, synchronization, and state changes. Not just as separate log messages, but as connected parts of one system.

I am also exploring the idea of controlled failure scenarios. Before any debugging or observability idea can be useful, I think it should be tested against known failures. That means creating cases where timing issues, blocked tasks, resource contention, synchronization problems, or state-machine issues can be reproduced and studied.

The goal is not to collect endless data.

More data can easily become more noise.

The goal is to collect the right information so an engineer can move faster from symptom to understanding.

## The takeaway

Building a small RTOS taught me that firmware debugging is not only about code correctness.

A system can compile. Individual functions can look correct. Logs can look normal. But the runtime behavior can still be wrong because of timing, scheduling, synchronization, or resource interactions.

That is the part I find most interesting.

Logs are useful, but firmware debugging needs better ways to reason about behavior over time.

The more embedded projects I worked on, the more I realized that debugging is not just about finding the wrong line of code.

It is about understanding the system behavior.

---

**Project reference:** [EE-6314 RTOS – TM4C123GH6PM Course Project](https://github.com/karangandhi-projects/EE-6314-RTOS)
