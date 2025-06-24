export function useMDXComponents(components) {
  return {
    // Use the default components (h1, h2, etc.) with their default styling
    // but override them with any components passed from the parent
    ...components,
    // You can add custom components here
    h1: (props) => <h1 className="text-3xl font-bold mb-6" {...props} />,
    h2: (props) => <h2 className="text-2xl font-semibold mb-4" {...props} />,
    h3: (props) => <h3 className="text-xl font-semibold mb-3" {...props} />,
    p: (props) => <p className="mb-4" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    hr: () => <hr className="my-8 border-t border-gray-300" />,
    strong: (props) => <strong className="font-bold" {...props} />,
    em: (props) => <em className="italic" {...props} />,
  }
}