import { useState, useCallback, useMemo } from "react";

const CHARS_PER_PAGE = 800; // Approximate characters that fit on one page
const LINES_PER_PAGE = 18;

export interface PageData {
  pageNumber: number;
  content: string;
  isEditable: boolean;
}

export const useDiaryPages = (content: string, setContent: (content: string) => void) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Split content into pages
  const pages = useMemo((): PageData[] => {
    if (!content || content.length === 0) {
      return [{ pageNumber: 1, content: "", isEditable: true }];
    }

    const pagesArray: PageData[] = [];
    const lines = content.split('\n');
    let currentPageContent = '';
    let currentLineCount = 0;
    let pageNumber = 1;

    for (const line of lines) {
      // Estimate how many visual lines this text line takes
      const visualLines = Math.ceil((line.length || 1) / 45); // ~45 chars per visual line
      
      if (currentLineCount + visualLines > LINES_PER_PAGE && currentPageContent.length > 0) {
        // Start a new page
        pagesArray.push({
          pageNumber,
          content: currentPageContent,
          isEditable: true,
        });
        pageNumber++;
        currentPageContent = line;
        currentLineCount = visualLines;
      } else {
        currentPageContent += (currentPageContent ? '\n' : '') + line;
        currentLineCount += visualLines;
      }
    }

    // Add the last page
    if (currentPageContent.length > 0 || pagesArray.length === 0) {
      pagesArray.push({
        pageNumber,
        content: currentPageContent,
        isEditable: true,
      });
    }

    return pagesArray;
  }, [content]);

  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex] || pages[0];
  const hasNextPage = currentPageIndex < totalPages - 1;
  const hasPreviousPage = currentPageIndex > 0;

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPageIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPageIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [hasPreviousPage]);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPageIndex(pageIndex);
    }
  }, [totalPages]);

  // Create a new blank page
  const createNewPage = useCallback(() => {
    // Add a page break marker to force new page
    const newContent = content + '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
    setContent(newContent);
    setCurrentPageIndex(totalPages);
  }, [content, setContent, totalPages]);

  // Update content for current page
  const updateCurrentPageContent = useCallback((newPageContent: string) => {
    // Reconstruct the full content with the updated page
    const allPagesContent = pages.map((page, index) => 
      index === currentPageIndex ? newPageContent : page.content
    );
    setContent(allPagesContent.join('\n'));
  }, [pages, currentPageIndex, setContent]);

  // Check if current page is nearly full
  const isPageNearlyFull = useMemo(() => {
    if (!currentPage) return false;
    const lines = currentPage.content.split('\n');
    let lineCount = 0;
    for (const line of lines) {
      lineCount += Math.ceil((line.length || 1) / 45);
    }
    return lineCount >= LINES_PER_PAGE - 2;
  }, [currentPage]);

  return {
    pages,
    currentPage,
    currentPageIndex,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    createNewPage,
    updateCurrentPageContent,
    isPageNearlyFull,
  };
};
