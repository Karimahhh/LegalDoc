const key = (slug: string) => `legaldoc.draft.${slug}`;

export const saveDraft = (slug: string, values: Record<string, string>) => {
  try {
    window.localStorage.setItem(key(slug), JSON.stringify(values));
  } catch {
    /* penyimpanan tidak tersedia */
  }
};

export const loadDraft = (slug: string): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
};

export const clearDraft = (slug: string) => {
  try {
    window.localStorage.removeItem(key(slug));
  } catch {
    /* penyimpanan tidak tersedia */
  }
};
