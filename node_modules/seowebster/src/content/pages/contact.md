---
title: "Contact Us"
description: "Get in touch with SEOWebster for a free SEO consultation. We're here to help grow your business online."
layout: "../../layouts/BaseLayout.astro"
hero:
  title: "Contact SEOWebster"
  description: "Ready to improve your search rankings? Get in touch for a free consultation and discover how we can help your business grow."
contact_info:
  - type: "email"
    icon: "📧"
    title: "Email"
    value: "hello@seowebster.com"
  - type: "phone"
    icon: "📞"
    title: "Phone"
    value: "+1 (555) 123-4567"
  - type: "address"
    icon: "📍"
    title: "Office"
    value: |
      123 SEO Street
      Digital City, DC 12345
form:
  title: "Send us a message"
  fields:
    - name: "name"
      label: "Name"
      type: "text"
      required: true
    - name: "email"
      label: "Email"
      type: "email"
      required: true
    - name: "company"
      label: "Company"
      type: "text"
      required: false
    - name: "message"
      label: "Message"
      type: "textarea"
      required: true
      placeholder: "Tell us about your SEO needs..."
  submit_button: "Send Message"
--- 