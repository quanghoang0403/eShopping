export function ThemeWrapper({ theme, themeSetting }) {
  return (
    <>
      <theme.component themeSetting={themeSetting} />
    </>
  );
}
