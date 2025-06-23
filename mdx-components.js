export function useMDXComponents(components) {
  return {
    // Use the default components (h1, h2, etc.) with their default styling
    // but override them with any components passed from the parent
    ...components,
  }
}