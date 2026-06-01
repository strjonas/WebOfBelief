import type { Metadata } from "next";
import { ContentPage, Prose } from "@/components/content-page";
import { contactEmail, operator } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Operator information and legal disclosures (§ 5 DDG).",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <ContentPage
      eyebrow="legal · impressum"
      title="Impressum"
      lede={
        <p>
          Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz) und § 18 Abs. 2 MStV.
        </p>
      }
    >
      <Prose>
        <h2>Diensteanbieter</h2>
        <p>
          {operator.name}
          <br />
          {operator.street}
          <br />
          {operator.city}
          <br />
          {operator.country}
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          {operator.name}, {operator.street}, {operator.city},{" "}
          {operator.country}
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
          Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
          hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
          Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
          Inhalte umgehend entfernen.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
          Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
          waren zum Zeitpunkt der Verlinkung nicht erkennbar. Bei Bekanntwerden
          von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers. Der Quellcode dieser Anwendung ist
          gesondert unter der MIT-Lizenz verfügbar; diese gilt ausschließlich für
          den Code, nicht für die übrigen Inhalte, den Namen oder das Design.
        </p>

        <h2>Online-Streitbeilegung / Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </Prose>
    </ContentPage>
  );
}
