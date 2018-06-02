---
layout: page
title: "Projects"
description: "Research Projects"
tags: [projects, research] 
comments: true
share: true
image:
  background: 
  feature:
  credit:
  creditlink:
---


### iTrace Infrastructure - Enabling Eye Tracking in Developer Environments
Software developers work with many source code files but each of these files typically is comprised of thousands of lines of code. They constantly flip through multiple files while reading and debugging code. Current state-of-the-art eye tracking software works well on fixed stimuli such as images but does not support tracking of developer gazes on these semantically and syntactically rich source code artifacts. Since source code files are really large, we cannot feasibly draw AOIs around each element to map gaze data to those regions. iTrace, our eye tracking infrastructure solves these problems making it easier for one to get started on conducting eye tracking studies in software engineering and related fields.

Web: http://www.i-trace.org

### Visualizing Eye Tracking Data in Eclipse
Due to the enormous size and richness
of data collected from the eye tracker, visualizations help both
the researcher and the developer to comprehend what transpired
during an eye tracking session. iTraceVis currently supports four
visualization views - heat map, gaze skyline, static gaze map,
and dynamic gaze map.
![iTraceVis Image]({{ site.url }}/images/iTraceVis.png)
{: .image-right}

### Emotional Awareness in Software Development
Emotional awareness, which falls under the popular subject of emotional intelligence, is the ability for people to understand and identify their emotions. It is, essentially, the ability to understand when you are “sad” or “happy” and then act appropriately. While there is much research being done on the effects of how emotions affect software development, there is little research on how the precise construct of emotional awareness affects developers while they are programming. The more we know about developers' emotions, the better we can support them by providing better tool help during development. 
![Emotion Faces Image]({{ site.url }}/images/emotionfaces.png)
{: .image-right}

### Eye Tracking on Natural Language Text and Source Code
About 70% of source code consists of identifiers with the rest being keywords or specific semantic structures such as an if or while statement.
This implies that a lot of source code involves pieces of natural text.  Do linear trends observed in natural language reading hold for novices reading source code? With respect to reading linearity, how to novices reading source code differ from experts? Novices read code less linearly than natural language whereas experts read code less linearly than novices.
![Natural Text Fixation Image]({{ site.url }}/images/NT.png)
{: .image-left}

### Eye Movements in Software Traceability
The iTrace environment, which is an eye tracking enabled Eclipse plugin, was used to collect eye gaze data. During the data collection phase, an eye tracker was used to gather the source code entities (SCE’s), developers looked at while solving these tasks. We present an algorithm that uses the collected gaze dataset to produce candidate traceability links related to the tasks. In the evaluation phase, we compared the results of our algorithm with the results of an IR technique, in two different contexts.
![Gaze Link Diagram]({{ site.url }}/images/gazelink.png)
{: .image-left}

### Eye Tracking Study Using Gaze and Interaction Logs
What are software developers doing during a change task? We hypothesize that if we know more about how software developers read, write, search and navigate code, that it enables us to build tools to support developers more efficiently. First study that simultaneously collects eye-tracking and interaction data while developers worked on realistic change tasks. Gathered new insights about fine-granular navigation behavior of developers. Gaze data captures more and in fact a different aspect of a developer’s navigation behavior. 
![Fixation Graph]({{ site.url }}/images/fse15graph.png)
{: .image-left}







