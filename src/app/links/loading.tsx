import PageContainer from "src/components/PageContainer/Page.component";

export default function LinksLoading() {
  return (
    <PageContainer contentAlign="top">
      <div aria-busy="true" aria-live="polite" />
    </PageContainer>
  );
}
