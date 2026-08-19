import Hero from "./component/hero";
import PageContent from "./component/PageContent";
// import NextSection from "./component/NextSection"

function App() {
  return (
    <main  className="overflow-y-hidden">
      <Hero />
      <PageContent />
    </main>
  );
}

export default App;