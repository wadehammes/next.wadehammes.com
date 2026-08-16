import PageContainer from "src/components/PageContainer/Page.component";

export default function Loading() {
  return (
    <PageContainer>
      <div aria-busy="true" aria-live="polite" />
    </PageContainer>
  );
}
