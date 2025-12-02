<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
	<xsl:output method="html" indent="yes" />

	<xsl:template match="/">
		<html lang="zh-CN">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title><xsl:value-of select="atom:feed/atom:title" /> - Atom Feed</title>
			<link rel="stylesheet" href="/atom.css" />
			<link rel="icon" href="{atom:feed/atom:icon}" />
		</head>

		<body>
			<header class="logo-header">
				<xsl:choose>
					<xsl:when test="atom:feed/atom:logo">
						<img class="logo" src="{atom:feed/atom:logo}" alt="" />
					</xsl:when>
					<xsl:otherwise>
						<svg class="logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="50" cy="50" r="50" fill="#667eea"/>
							<text x="50" y="65" text-anchor="middle" fill="white" font-size="40" font-weight="bold">F</text>
						</svg>
					</xsl:otherwise>
				</xsl:choose>
				<div>
					<h1 class="title"><xsl:value-of select="atom:feed/atom:title" /></h1>
					<div class="subtitle"><xsl:value-of select="atom:feed/atom:subtitle" /></div>
				</div>
			</header>

			<blockquote>
				<p>本页面是 Atom 订阅源，可直接被订阅。</p>
				<p><xsl:value-of select="atom:feed/atom:description" /></p>
			</blockquote>

			<main>
				<xsl:apply-templates select="atom:feed/atom:entry" />
			</main>

			<footer>
				<xsl:value-of select="atom:feed/atom:rights" />
				<br />
				由 <a href="https://nextjs.org"><xsl:value-of select="atom:feed/atom:generator" /></a> 生成
			</footer>
		</body>
		</html>
	</xsl:template>

	<xsl:template match="atom:entry">
		<a href="{atom:link/@href}" class="entry" target="_blank">
			<xsl:if test="atom:cover">
				<img class="entry-image" src="{atom:cover}" alt="{atom:title}" loading="lazy" />
			</xsl:if>

			<article>
				<h2 class="entry-title">
					<xsl:value-of select="atom:title" />
				</h2>

				<xsl:if test="atom:summary">
					<div class="entry-summary">
						<xsl:value-of select="atom:summary" />
					</div>
				</xsl:if>

				<div class="entry-meta">
					发布于 <xsl:value-of select="substring(atom:published, 1, 10)" />

					<xsl:if test="atom:updated and atom:updated != atom:published">
						 · 更新于 <xsl:value-of select="substring(atom:updated, 1, 10)" />
					</xsl:if>

					<xsl:if test="atom:category">
						<span class="category-tag">
							<xsl:value-of select="atom:category[1]/@term" />
						</span>
					</xsl:if>
				</div>
			</article>
		</a>
	</xsl:template>

</xsl:stylesheet>
