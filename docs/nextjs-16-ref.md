# Next.js 16 Reference

## Key Features

### React Compiler (Stable)
- **Automatic Memoization**: Eliminates the need for `useMemo` and `useCallback` by automatically optimizing components at build time.
- **Setup**:
    1.  Install `babel-plugin-react-compiler`.
    2.  Add `reactCompiler: true` to `next.config.js`.

### Server Actions (Enhanced)
- Improved stability and security for executing server-side code directly from components.

### React 19 Support
- Includes support for React 19 features like Actions, `useFormStatus`, and `useOptimistic`.

### Turbopack
- Faster local development builds (now more stable).

## Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [React Compiler Blog Post](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024)
