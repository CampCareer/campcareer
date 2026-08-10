# CampCareer Product Core

The authoritative product strategy is in [PRODUCT_DOCTRINE.md](./PRODUCT_DOCTRINE.md). This file is the concise execution rule.

## Job to be done

Help a prospective international student or worker answer:

> What is the best realistic country–city–occupation–study route for my situation, and what should I do next?

## Required result states

- **General Overview:** country/city/occupation market evidence for users who are exploring or have incomplete inputs.
- **Personalised Overview:** route ranking only after the necessary personal facts are collected.
- **Evidence confidence:** always separate from opportunity and fit scores.
- **Blocker state:** show legal, qualification, registration, or timing constraints plainly; never bury them in a score.

## Required UX sequence

`Light search → immediate useful Overview → contextual short questions → personal route ranking → save / monitor / explore`

Unknown destination and unknown occupation are valid starting states. Login follows value; it does not precede it.

## Data and publication rule

A strong recommendation requires linked, source-dated evidence for citizenship, destination, city, occupation, programme, institution, and legal/work pathway where applicable. If the evidence is incomplete, publish an exploration state with a lower confidence label rather than a fabricated complete result.

## Current build order

1. Lock the Home exploration and Overview experience.
2. Make Market Opportunity understandable and explainable.
3. Add progressive personalisation and My Pathway Fit.
4. Connect scores to cities, occupations, programmes, institutions, and legal paths.
5. Add saved scenarios and change alerts after the first useful result is proven.
