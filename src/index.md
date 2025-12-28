---
layout: layouts/base.njk
title: Petal Diary
description: 花瓣手账，记录生活的美好瞬间
---

<div class="hero">
  <div class="hero-content">
    <h1 class="hero-title">
      Petal Diary
    </h1>
    <p class="hero-subtitle">花瓣手账 · 记录生活的美好瞬间</p>
    <p class="hero-description">
      这里是一个充满少女心的小天地，记录着生活中的甜蜜食谱、旅行足迹和灵感笔记。
    </p>
    <div class="hero-links">
      <a href="/recipes" class="btn btn-primary">
        <span class="btn-icon">🍰</span>
        甜蜜食谱
      </a>
      <a href="/travels" class="btn btn-secondary">
        <span class="btn-icon">✈️</span>
        漫游地图
      </a>
      <a href="/notes" class="btn btn-tertiary">
        <span class="btn-icon">📝</span>
        灵感笔记
      </a>
      <a href="/comments" class="btn btn-quaternary">
        <span class="btn-icon">💕</span>
        留言板
      </a>
    </div>
  </div>
  <div class="hero-decoration">
    <div class="floating-element" style="--delay: 0s;">🌸</div>
    <div class="floating-element" style="--delay: 1s;">💖</div>
    <div class="floating-element" style="--delay: 2s;">✨</div>
    <div class="floating-element" style="--delay: 3s;">🌷</div>
  </div>
</div>

<div class="content-section">
  <div class="section-card">
    <div class="card-icon">🌱</div>
    <h2>我的小花圃</h2>
    <p>关于我、我的兴趣和日常生活的小确幸。</p>
    <a href="/about" class="card-link">了解更多 →</a>
  </div>
  
  <div class="recent-content">
    <h3>最新动态</h3>
    <div class="recent-grid">
      {%- for recipe in collections.recipes -%}
        {%- if recipe.url != '/recipes/index.html' and loop.index <= 2 -%}
        <div class="recent-item">
          <span class="item-category recipe">🍰 食谱</span>
          <h4>{{ recipe.data.title }}</h4>
          <p>{{ recipe.data.description | truncate(60) }}</p>
          <div class="recent-item-footer">
            <small>{{ recipe.date | postDate }}</small>
            <a href="{{ recipe.url }}" class="read-more">阅读原文 →</a>
          </div>
        </div>
        {%- endif -%}
      {%- endfor -%}
      {%- for travel in collections.travels -%}
        {%- if travel.url != '/travels/index.html' and loop.index <= 2 -%}
        <div class="recent-item">
          <span class="item-category travel">✈️ 旅行</span>
          <h4>{{ travel.data.title }}</h4>
          <p>{{ travel.data.description | truncate(60) }}</p>
          <div class="recent-item-footer">
            <small>{{ travel.date | postDate }}</small>
            <a href="{{ travel.url }}" class="read-more">查看游记 →</a>
          </div>
        </div>
        {%- endif -%}
      {%- endfor -%}
      {%- for note in collections.notes -%}
        {%- if note.url != '/notes/index.html' and loop.index <= 2 -%}
        <div class="recent-item">
          <span class="item-category note">📝 笔记</span>
          <h4>{{ note.data.title }}</h4>
          <p>{{ note.data.description | truncate(60) }}</p>
          <div class="recent-item-footer">
            <small>{{ note.date | postDate }}</small>
            <a href="{{ note.url }}" class="read-more">阅读全文 →</a>
          </div>
        </div>
        {%- endif -%}
      {%- endfor -%}
    </div>
  </div>
</div>