import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the ApsaraMenu application."
}

export default function TermsPage() {
  const application = "ApsaraMenu"
  return (
    <section className="prose prose-gray dark:prose-invert mt-10">
      <h1>Terms of Service</h1>
      <h2 className="font-medium text-gray-500">
        Effective as of June 1, 2024
      </h2>
      <ol>
        <li>
          <p>
            <strong>Agreement.</strong> The following Terms of Service (the{" "}
            <strong>&quot;Terms&quot;</strong>) constitute a binding agreement
            between you and {application} Software ({" "}
            <strong>&quot;{application}&quot;,</strong>{" "}
            <strong>&quot;we&quot;,</strong> <strong>&quot;our&quot;</strong>{" "}
            and <strong>&quot;us&quot;</strong>), the operator of the{" "}
            {application} platform (the <strong>&quot;Platform&quot;</strong>).
            These Terms establish conditions regarding your access and use of
            the Platform.
          </p>
          <p>
            By accessing or using the Platform in any way, you agree to be bound
            by these Terms.
          </p>
          <p>
            Your access and use of the Platform is on behalf of one or more
            organizations to which you are affiliated (each, an{" "}
            <strong>&quot;Organization&quot;</strong>). {application} and each
            of the Organizations have entered into a separate agreement (the{" "}
            <strong>&quot;Organization Agreement&quot;</strong>) that governs
            the provision of {application} services to that Organization. These
            Terms do not alter in any way the terms of the Organization
            Agreements. To the extent these Terms conflict with the Organization
            Agreements, the terms of the Organization Agreements shall prevail.
          </p>
        </li>
        <li>
          <p>
            <strong>Modification.</strong> {application} reserves the right, at
            its sole discretion, to modify these Terms at any time and without
            prior notice. The date of the last modification of the Terms will be
            posted at the beginning of these Terms. It is your responsibility to
            periodically check for updates. By continuing to access or use the
            Platform, you indicate that you agree to be bound by the modified
            Terms.
          </p>
        </li>
        <li>
          <strong>Privacy.</strong> These Terms include the provisions of this
          document, as well as those of our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </li>
        <li>
          <p>
            <strong>Acceptable Use.</strong> {application} hereby grants you
            permission to access and use the Platform, provided that such use
            complies with these Terms and, furthermore, you specifically agree
            that your use will comply with the following restrictions and
            obligations:
          </p>
          <ul>
            <li>
              You may only use the Platform on behalf of the Organizations and
              only as permitted in the Organization Agreements.
            </li>
            <li>
              You may not transfer your access to others or allow others to
              access the Platform through your own access.
            </li>
            <li>
              You may only use the Platform for legal activities. It is your
              responsibility to comply with all applicable local, state, and
              federal laws and regulations.
            </li>
            <li>
              You may not decompile, reverse engineer, or attempt to obtain the
              source code or underlying ideas or information from or related to
              the Platform.
            </li>
            <li>
              You may not enter, store, or transmit viruses, worms, or other
              malicious code within, through, to, or using the Platform.
            </li>
            <li>
              You may not override, circumvent, bypass, remove, disable, or
              otherwise defeat any software protection mechanism on the
              Platform.
            </li>
            <li>
              You may not remove or hide any product identification, copyright,
              or other proprietary notice from any element of the Platform or
              associated documentation.
            </li>
          </ul>
        </li>
        <li>
          <p>
            <strong>User Accounts.</strong> You may create an account by logging
            in with your account on certain third-party platforms
            (&quot;Third-Party Authenticators&quot;, including but not limited
            to Google). The Third-Party Authenticator will determine what
            information we can access and use. Your {application} account will
            be created for your use of the Platform based on the personal
            information you provide us or that we obtain through the Third-Party
            Authenticator.
          </p>
          <p>
            You and the Organizations are responsible for maintaining the
            confidentiality of your password and account, and are fully
            responsible for any and all activities that occur under your
            password or account. You agree to (a) immediately notify{" "}
            {application} of any unauthorized use of your password or account or
            any other security breach, and (b) ensure that you log out of your
            account at the end of each session when accessing the Platform.{" "}
            {application} will not be liable for any loss or damage arising from
            your failure to comply with this section.
          </p>
          <p>
            If you want us to cancel your account, please follow the procedures
            set forth in our <Link href="/privacy">Privacy Policy.</Link>
          </p>
          <p>
            You may not transfer your account to anyone else without our prior
            written permission.
          </p>
        </li>
        <li>
          <p>
            <strong>Content.</strong> Each Organization owns all content it
            submits through the Platform, including any content that you or
            other representatives of the Organization submit through the
            Platform (collectively, the{" "}
            <strong>&quot;Organization Content&quot;</strong>).{" "}
          </p>
          <p>
            You may not use, copy, adapt, modify, prepare derivative works based
            on, distribute, license, sell, transfer, publicly display, publicly
            perform, transmit, broadcast, or otherwise exploit {application}{" "}
            Content, except as necessary to access and use the Platform on
            behalf of the Organizations in accordance with these Terms and the
            Organization Agreements.
          </p>
        </li>
        <li>
          <p>
            <strong>Third-Party Applications.</strong> You or the Organizations
            may choose to use certain third-party products or services in
            connection with the Platform (the{" "}
            <strong>&quot;Third-Party Applications&quot;</strong>). Your use of
            any Third-Party Application is subject to a separate agreement
            between the corresponding Organization and the provider of that
            Third-Party Application (the{" "}
            <strong>&quot;Third-Party Provider&quot;</strong>) or you and the
            Third-Party Provider. You hereby acknowledge that {application} does
            not control such Third-Party Providers or Third-Party Applications
            and is not responsible for their content, operation, or use.{" "}
            {application} makes no representation, warranty, or endorsement,
            express or implied, regarding the legality, accuracy, quality, or
            authenticity of the content, information, or services provided by
            Third-Party Applications. {application} HEREBY DISCLAIMS ALL
            LIABILITY FOR ANY THIRD-PARTY APPLICATION AND FOR THE ACTS OR
            OMISSIONS OF ANY THIRD-PARTY PROVIDER, and you hereby irrevocably
            waive any claim against {application} with respect to the content or
            operation of any Third-Party Application.
          </p>
        </li>
        <li>
          <strong>Feedback.</strong> We welcome and encourage you to provide
          your feedback, comments, and suggestions for improving the Platform ({" "}
          <strong>&quot;Feedback&quot;</strong>). You agree that {application}{" "}
          has the right, but not the obligation, to use such Feedback without
          any obligation to provide you with credit, royalty payment, or
          ownership interest in changes to the Platform.
        </li>
        <li>
          <p>
            <strong>Termination.</strong> {application} may immediately
            terminate these Terms without notice and disable your access to the
            Platform if {application} determines, in its sole discretion, that
            (a) you have violated these Terms, or (b) you have violated
            applicable laws, regulations, or third-party rights. Additionally,
            if all Organization Agreements expire or are terminated for any
            reason, {application} will immediately terminate these Terms and
            your access to the Platform. {application} may temporarily suspend
            your access to the Platform under certain circumstances set forth in
            the Organization Agreements.
          </p>
          <p>
            Provisions that by their nature should survive termination of these
            Terms will remain in effect. By way of example, all of the following
            will survive termination: any limitation of our liability, any terms
            regarding ownership or intellectual property rights, and terms
            relating to disputes between us.
          </p>
        </li>
        <li>
          <p>
            <strong>Disclaimer of Warranties.</strong> YOU HEREBY ACKNOWLEDGE
            THAT YOU ARE USING THE PLATFORM AT YOUR OWN RISK. THE PLATFORM AND{" "}
            {application} CONTENT ARE PROVIDED &quot;AS IS,&quot; AND{" "}
            {application}, ITS AFFILIATES, AND ITS THIRD-PARTY SERVICE PROVIDERS
            HEREBY DISCLAIM ANY WARRANTIES, EXPRESS AND IMPLIED, INCLUDING BUT
            NOT LIMITED TO ANY WARRANTIES OF ACCURACY, RELIABILITY,
            MERCHANTABILITY, NON-INFRINGEMENT, FITNESS FOR A PARTICULAR PURPOSE,
            AND ANY OTHER WARRANTY, CONDITION, OR REPRESENTATION, WHETHER ORAL,
            WRITTEN, OR IN ELECTRONIC FORM. {application}, ITS AFFILIATES, AND
            ITS THIRD-PARTY SERVICE PROVIDERS DO NOT REPRESENT OR WARRANT THAT
            ACCESS TO THE PLATFORM WILL BE UNINTERRUPTED OR THAT THERE WILL BE
            NO FAILURES, ERRORS, OR OMISSIONS OR LOSS OF TRANSMITTED
            INFORMATION, OR THAT NO VIRUSES WILL BE TRANSMITTED THROUGH THE
            PLATFORM.
          </p>
          <p>
            Because some states do not allow the disclaimer of implied
            warranties, you may have additional rights under local laws.
          </p>
        </li>
        <li>
          <p>
            <strong>Limitation of Liability.</strong> YOUR ACCESS AND USE OF THE
            PLATFORM IS ON BEHALF OF ONE OR MORE ORGANIZATIONS. CONSEQUENTLY, TO
            THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, UNDER NO
            CIRCUMSTANCES AND UNDER NO LEGAL THEORY (INCLUDING WITHOUT
            LIMITATION TORT, CONTRACT, STRICT LIABILITY, OR OTHERWISE) SHALL{" "}
            {application} (OR ITS LICENSORS OR PROVIDERS) BE LIABLE TO YOU FOR
            ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
            OF ANY KIND, INCLUDING DAMAGES FOR LOSS OF PROFITS, LOSS OF
            GOODWILL, WORK STOPPAGE, ACCURACY OF RESULTS, OR COMPUTER FAILURE OR
            MALFUNCTION.
          </p>
        </li>
        <li>
          <strong>Notices.</strong> Any notice or other communication permitted
          or required hereunder shall be in writing and shall be delivered by{" "}
          {application} (a) by email (in each case to the address you provide)
          or (b) by posting on the website.
        </li>
        <li>
          <strong>No Waiver.</strong> The failure of {application} to enforce
          any right or provision of these Terms shall not constitute a waiver of
          future enforcement of that right or provision.
        </li>
        <li>
          <strong>Assignment.</strong> You may not assign or transfer these
          Terms, by operation of law or otherwise, without the prior written
          consent of {application}. Any attempt by you to assign or transfer
          these Terms without such consent shall be void and of no effect.{" "}
          {application} may assign or transfer these Terms, at its sole
          discretion, without restriction. Subject to the foregoing, these Terms
          shall bind and inure to the benefit of the parties, their successors,
          and permitted assigns. Unless a person or entity is explicitly
          identified as a third-party beneficiary of these Terms, these Terms do
          not confer and are not intended to confer any rights or remedies upon
          any person or entity other than the parties.
        </li>
        <li>
          <strong>Severability.</strong> If for any reason an arbitrator or
          court of competent jurisdiction determines that any provision of these
          Terms is invalid or unenforceable, that provision shall be enforced to
          the maximum extent permitted and the other provisions of these Terms
          shall remain in full force and effect.
        </li>
        <li>
          <strong>Governing Law.</strong> The laws of the State of California,
          without reference to its choice of law or conflict of laws rules or
          principles, shall govern these Terms and any dispute of any kind that
          may arise between you and {application} with respect to these Terms.
          Notwithstanding the foregoing, you acknowledge that, since your access
          and use of the Platform is on behalf of one or more Organizations and
          is subject to the Organization Agreements, any dispute arising from
          your use of the Platform will be handled in accordance with the
          dispute resolution process set forth in the applicable Organization
          Agreements.
        </li>
        <li>
          <strong>Entire Agreement.</strong> These Terms constitute the entire
          agreement between you and {application} with respect to your use of
          the Platform, and supersede all prior agreements, written or oral,
          other than the Organization Agreements.
        </li>
      </ol>
    </section>
  )
}
