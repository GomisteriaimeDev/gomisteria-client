import React from "react";
import "./PrivacyPolicy.scss";
import Footer from "../../components/Footer/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="privacyPolicyWrapper">

        {/* ===== POLITIKA E PRIVATËSISË ===== */}
        <div className="privacy-policy-section">
          <h1>Politikë e Privatësisë – www.gomisteriaime.com</h1>
          <p>
            Në Gomisteria Ime, ne vlerësojmë besimin tuaj dhe jemi të përkushtuar për mbrojtjen e
            të dhënave tuaja personale. Kjo Politikë e Privatësisë shpjegon se si ne mbledhim,
            përdorim dhe mbrojmë informacionin tuaj kur përdorni platformën tonë.
          </p>
          <p>
            Duke u regjistruar në webfaqen tonë, ju pajtoheni automatikisht me kushtet e
            përshkruara më poshtë.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>1. Mbledhja e të Dhënave</h4>
          <p>
            Gjatë procesit të regjistrimit (si Individ ose si Subjekt/Biznes), ne mbledhim të
            dhënat e nevojshme për identifikimin dhe ofrimin e shërbimit:
          </p>
          <ul>
            <li>
              <strong>Për Individët:</strong> Emri, mbiemri, numri i telefonit, adresa, e-mail adresa.
            </li>
            <li>
              <strong>Për Subjektet:</strong> Emri i firmës, Numri Unik Fiskal, adresa e biznesit,
              numri i telefonit të personit kontaktues.
            </li>
          </ul>
        </div>

        <div className="privacy-policy-section">
          <h4>2. Verifikimi i Llogarisë</h4>
          <p>
            Të dhënat e dërguara gjatë regjistrimit kalojnë në sistemin tonë administrativ.
            Administratorët e Gomisteria Ime kanë të drejtën të rishikojnë këto të dhëna dhe të
            vendosin për aktivizimin ose jo të llogarisë suaj, me qëllim parandalimin e
            keqpërdorimeve.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>3. Përdorimi i të Dhënave dhe Shërbimet</h4>
          <p>Të dhënat tuaja përdoren për të mundësuar:</p>
          <ul>
            <li>
              <strong>Shitjen Online:</strong> Procesimin e porosive për goma, fellne dhe aksesorë.
            </li>
            <li>
              <strong>Ndërmjetësimin e Shërbimeve:</strong> Caktimin e termineve me partnerët tanë
              për montim, balancim, hotel të gomave dhe riparime.
            </li>
            <li>
              <strong>Asistencën Rrugore:</strong> Ndërmjetësimin me palë të treta për shërbime si
              karroteci, taxi, rent-a-car dhe gomisteri lëvizëse.
            </li>
            <li>
              <strong>Rezervimet e Produkteve:</strong> Mundësinë për të rezervuar produkte që
              "Vijnë së shpejti".
            </li>
          </ul>
          <p>
            <strong>Shënim:</strong> Data e arritjes së produkteve në ardhje është informative dhe
            mund të ndryshojë. Ne nuk mbajmë përgjegjësi për vonesat që mund të shkaktohen nga
            proceset logjistike.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>4. Menaxhimi i Llogarisë dhe Siguria</h4>
          <p>Klientët kanë kontroll të plotë mbi llogarinë e tyre, ku mund të:</p>
          <ul>
            <li>Shohin raportet e blerjeve dhe faturat.</li>
            <li>Gjurmojnë porositë dhe rezervimet.</li>
            <li>Përdorin opsionin e "fshehjes së çmimeve" për privatësi gjatë navigimit.</li>
            <li>Menaxhojnë dy lloje të shportave (Stoku aktual dhe Produktet në ardhje).</li>
          </ul>
        </div>

        <div className="privacy-policy-section">
          <h4>5. Komunikimi dhe Marketingu</h4>
          <p>
            Duke u regjistruar, ju pranoni që Gomisteria Ime mund t'ju dërgojë njoftime mbi
            ofertat, uljet dhe informacionet e rëndësishme përmes:
          </p>
          <ul>
            <li>SMS në numrin tuaj të telefonit.</li>
            <li>E-mail në adresën tuaj elektronike.</li>
          </ul>
          <p>
            Ju mund të kërkoni ndalimin e këtyre njoftimeve në çdo kohë përmes kontaktit tonë
            zyrtar.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>6. Ndarja e të Dhënave me Palët e Treta</h4>
          <p>
            Për qëllime të ndërmjetësimit (p.sh. asistenca rrugore ose caktimi i terminit në
            servis), ne do të ndajmë vetëm të dhënat e nevojshme (si emrin dhe numrin e telefonit)
            me partnerët tanë që kryejnë shërbimin, gjithmonë duke u bazuar në kërkesën tuaj.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>7. Të Drejtat tuaja</h4>
          <p>
            Sipas Ligjit për Mbrojtjen e të Dhënave Personale në Kosovë, ju keni të drejtë të
            kërkoni qasje në të dhënat tuaja, korrigjimin e tyre ose fshirjen e llogarisë tuaj nga
            sistemi ynë.
          </p>
        </div>

        {/* ===== KUSHTET E PËRDORIMIT ===== */}
        <div className="privacy-policy-section">
          <h1>Kushtet e Përdorimit – www.gomisteriaime.com</h1>
          <p>
            Mirësevini në Gomisteria Ime. Duke përdorur platformën tonë dhe duke krijuar një llogari
            (si individ apo biznes), ju pranoni të respektoni kushtet e mëposhtme:
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>1. Saktësia e të Dhënave të Regjistrimit</h4>
          <p>
            Përdoruesi obligohet që të dhënat e dhëna gjatë regjistrimit (si ato personale, ashtu
            edhe ato të biznesit/fiskale) të jenë të sakta dhe të vërteta. Gomisteria Ime rezervon
            të drejtën të pezullojë ose fshijë çdo llogari nëse dyshohet për të dhëna të rreme apo
            aktivitet të parregullt.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>2. Produktet dhe Çmimet</h4>
          <ul>
            <li>
              <strong>Stoku dhe Çmimet:</strong> Klientët kanë qasje në kohë reale në sasinë e
              stokut dhe çmimet. Ne përpiqemi që këto informata të jenë gjithmonë të sakta, por në
              raste të rralla të gabimeve teknike, ne rezervojmë të drejtën të anulojmë porosinë dhe
              të njoftojmë klientin.
            </li>
            <li>
              <strong>Fshehja e Çmimeve:</strong> Sistemi ofron opsionin e fshehjes së çmimeve
              (ikonën e syrit). Ky është një funksion vizual për përdoruesin dhe nuk ndryshon
              vlerën reale të faturimit të produkteve.
            </li>
          </ul>
        </div>

        <div className="privacy-policy-section">
          <h4>3. Produktet "Së Shpejti" dhe Rezervimet</h4>
          <p>Platforma mundëson shikimin dhe rezervimin e produkteve që janë në proces të arritjes.</p>
          <ul>
            <li>
              <strong>Vonesat:</strong> Data e paraparë e arritjes është vetëm një vlerësim.
              Gomisteria Ime nuk mban përgjegjësi ligjore apo financiare për vonesat që mund të
              ndodhin si pasojë e transportit ndërkombëtar, procedurave doganore apo faktorëve të
              tjerë jashtë kontrollit tonë.
            </li>
            <li>
              <strong>Rezervimi:</strong> Rezervimi i produktit nuk garanton çmimin fiks nëse ka
              ndryshime ekstreme në treg deri në momentin e arritjes, përveç nëse është bërë
              parapagimi i plotë.
            </li>
          </ul>
        </div>

        <div className="privacy-policy-section">
          <h4>4. Ndërmjetësimi për Shërbime dhe Asistencë</h4>
          <p>
            Gomisteria Ime vepron si ndërmjetës mes klientit dhe firmave partnere për shërbime si:
          </p>
          <ul>
            <li>
              <strong>Servisi:</strong> Montim, balancim, drejtim, hotel i gomave, riparime.
            </li>
            <li>
              <strong>Asistenca:</strong> Karroteci, taxi, rent-a-car, etj.
            </li>
          </ul>
          <p>
            <strong>Kufizimi i Përgjegjësisë:</strong> Pasi që shërbimi kryhet nga firma të treta,
            Gomisteria Ime nuk mban përgjegjësi për cilësinë e punës, dëmtimet e mundshme gjatë
            shërbimit apo vonesat e partnerëve. Çdo ankesë për shërbimin fizik duhet t'i drejtohet
            drejtpërdrejt ofruesit të atij shërbimi.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>5. Menaxhimi i Shportave</h4>
          <p>Përdoruesi ka dy shporta të ndara:</p>
          <ol>
            <li>
              <strong>Shporta e Stokut:</strong> Për produkte që janë menjëherë të disponueshme.
            </li>
            <li>
              <strong>Shporta "Së Shpejti":</strong> Për produkte që priten të vijnë.
            </li>
          </ol>
          <p>
            Klienti duhet të jetë i vëmendshëm gjatë procesimit të pagesës/porosisë se nga cila
            shportë po porosit, pasi afatet e livrimit ndryshojnë rrënjësisht mes tyre.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>6. Komunikimi Marketing</h4>
          <p>
            Përdoruesi pranon që administratorët mund të dërgojnë oferta speciale, fatura apo
            njoftime mbi statusin e porosisë përmes SMS-ve dhe E-mailit. Ky komunikim është pjesë e
            shërbimit të platformës për të mbajtur klientin të informuar.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>7. Ndryshimet e Kushteve</h4>
          <p>
            Gomisteria Ime rezervon të drejtën të përditësojë këto kushte në çdo kohë. Klientët do
            të njoftohen përmes platformës për çdo ndryshim madhor.
          </p>
        </div>

        <div className="privacy-policy-section">
          <h4>8. Mënyra e Pagesës dhe Faturimi</h4>
          <ul>
            <li>
              <strong>Subjekti Faturues:</strong> Të gjitha transaksionet për produktet (goma,
              fellne, aksesorë) faturuhen nga biznesi{" "}
              <strong>Fortuna-f n.t.p (Gani Lalinovci B.i)</strong>, Nr. Fiskal:{" "}
              <strong>811066225</strong>.
            </li>
            <li>
              <strong>Metodat e Pagesës:</strong>
              <ul>
                <li>
                  <strong>Për Individët:</strong> Pagesa mund të bëhet me para në dorë (Cash) në
                  momentin e pranimit të produktit/shërbimit.
                </li>
                <li>
                  <strong>Për Subjektet (Bizneset):</strong>
                  <ul>
                    <li>
                      Për faturat me vlerë deri në <strong>299.99€</strong>, pagesa mund të bëhet me
                      para në dorë (Cash).
                    </li>
                    <li>
                      Për faturat me vlerë <strong>300.00€ e sipër</strong>, sipas legjislacionit në
                      fuqi në Republikën e Kosovës, pagesa duhet të bëhet detyrimisht përmes
                      Transaksionit Bankar në llogarinë zyrtare të Fortuna-f n.t.p.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>Ndërmjetësimi:</strong> Për shërbimet e ndërmjetësuara (Asistencë rrugore,
              Servis, etj.), faturimi dhe pagesa rregullohen direkt me firmën partnere që kryen
              shërbimin.
            </li>
          </ul>
        </div>

        <div className="privacy-policy-section">
          <h4>9. Përgjegjësia e Faturimit dhe Transaksioneve</h4>
          <p>
            Për të siguruar transparencë të plotë, klientët njoftohen se përgjegjësia e faturimit
            ndryshon varësisht nga lloji i shërbimit:
          </p>
          <ul>
            <li>
              <strong>Për Produktet (Goma, Fellne, Aksesorë):</strong> Të gjitha transaksionet për
              produktet që janë në stokun tonë ose vijnë së shpejti, faturimi bëhet drejtpërdrejt
              nga biznesi <strong>Fortuna-f n.t.p (Gani Lalinovci B.i)</strong> me nr. fiskal{" "}
              <strong>811066225</strong>. Pagesa bëhet me kesh (para në dorë) me rastin e pranimit
              të mallit, ose pagesë përmes bankës nëpërmjet faturës.
            </li>
            <li>
              <strong>Për Shërbimet e Ndërmjetësuara (Shërbim &amp; Asistencë):</strong> Kur
              platforma përdoret për të caktuar termine ose për të thirrur asistencë rrugore (Taxi,
              Karroteci, etj.), gomisteriaime.com luan vetëm rolin e ndërmjetësuesit.
              <ul>
                <li>
                  Në këto raste, faturimi i shërbimit bëhet nga firma partnere që e kryen shërbimin
                  fizik.
                </li>
                <li>
                  Klienti paguan direkt ofruesin e shërbimit sipas çmimeve të tyre.
                </li>
              </ul>
            </li>
          </ul>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
