import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Financial Abuse Support",
  description:
    "Financial abuse can happen to anyone. Learn how Ally can help you regain control of your banking, recognise the warning signs, and access confidential support.",
  path: "/financial-abuse",
});

export default function FinancialAbusePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Support", href: "/support" },
          { label: "Financial abuse support" },
        ]}
      />

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h1 className="max-w-2xl text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Financial abuse support
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              Financial abuse occurs when one person manipulates another to
              control their finances and property without their consent.
            </p>
            <p>
              There are many types of financial abuse and it can happen to
              anyone, no matter how old, or how much money they have.
            </p>
            <p>
              If you feel you&apos;re in a financially abusive situation, please
              do not hesitate to speak to any member of our staff.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
              How we can help you
            </h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                There are many different ways we can help you to regain control
                of your banking. Of course this will depend on your personal
                circumstances as everyone&apos;s situation will be different.
              </p>
              <p>
                Our staff will also ensure that we respect your privacy and
                confidentiality. We know that telling us about your
                circumstances may be difficult, and our goal is to minimise you
                repeating your story.
              </p>
              <p>
                We have also established a specialised team who can help you, or
                your authorised representative, regain control of your finances.
                Our staff will protect your confidentiality and safety at all
                times.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Visit — any of our branches</li>
                <li>
                  Email —{" "}
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="text-primary underline"
                  >
                    {siteConfig.contactEmail}
                  </a>{" "}
                  between 8.30am and 5.00pm, Mon-Fri
                </li>
                <li>Or complete our online form</li>
              </ul>
            </div>
          </div>
          <div>
            <Link
              href="/locate"
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
            >
              Find a branch
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Are you experiencing financial abuse?
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Financial abuse can come in the form of Elder, Domestic, Disability
            and/or Language/Cultural abuse.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                Elder
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>
                  Elder financial abuse is a specific form of exploitation. It
                  may also be emotional abuse. In general, it is an effort by
                  unscrupulous person/s to extract money and resources through a
                  variety of devious means from elderly persons.
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>deceit</li>
                  <li>forgery</li>
                  <li>coercion through bullying and intimidation</li>
                  <li>undue influence for personal gain</li>
                  <li>
                    misuse of a person&apos;s Power of Attorney or Guardianship
                    instructions
                  </li>
                </ul>
                <p>
                  In general, all involve improper use of an older person&apos;s
                  assets.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                Disability
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>
                  Financial abuse of a disabled person is any act involving the
                  misuse of the person&apos;s money or property. This is done
                  without their full knowledge, consent or understanding.
                </p>
                <p>
                  This can be against an individual with a physical and/or
                  mental disability. It deprives them of vital financial
                  resources for their personal needs.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                Domestic
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>
                  Domestic financial abuse may occur when a person uses money as
                  a means to gain power and control over their partner. This
                  type of abuse is when a victim can be trapped in an abusive
                  relationship, with the person doing such things as:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>forbidding access to bank accounts</li>
                  <li>providing an inadequate allowance</li>
                  <li>not allowing the victim to work</li>
                  <li>
                    forcing the victim to sign documents or make false
                    declarations
                  </li>
                  <li>
                    denying that the victim has an entitlement to joint
                    property.
                  </li>
                </ul>
                <p>
                  This type of financial abuse can be subtle. A person gradually
                  takes control over bank accounts and financial transactions.
                  It may not be until after a relationship has ended that the
                  customer realises they are a victim of financial abuse.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                Language/Cultural
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>
                  People who speak little English, including from Indigenous
                  communities, are at an increased risk of financial abuse.
                </p>
                <p>
                  Due to the difficulties in gaining information about banking
                  services and products, they often trust others to help. This
                  can be a trusted family member or friend, who they use to
                  interpret for them. This can lead to the person becoming a
                  victim of financial abuse without their full understanding of
                  the circumstances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Frequently asked questions
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                Why is the Bank focusing on Financial Abuse?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The community&apos;s expectations have changed over time and it
                is now recognised that we all have a part to play in assisting
                those vulnerable members of our community.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                What is financial abuse?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Financial abuse is when someone takes away your access to money.
                A person may manipulate your financial decisions or use your
                money without consent. Once you know this, let our staff know,
                as there are ways to get help and regain your independence.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                What can the Bank offer customers impacted by financial abuse?
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>
                  Our staff have been trained to recognise and assist a customer
                  who may be a victim of financial abuse. It is important for us
                  to help and support customers to navigate through their
                  situation to financial independence. This may include:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Arranging new accounts or other banking services.</li>
                  <li>
                    Working with different areas of the bank on the
                    customer&apos;s behalf.
                  </li>
                  <li>
                    Referring customers to external agencies and financial
                    counsellors.
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                Are there some warning signs I should look out for?
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>Yes there are many. Here&apos;s just a few:</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    Check your transactions regularly and let us know if there
                    are any transactions you don&apos;t recognise.
                  </li>
                  <li>
                    Don&apos;t let anyone speak for you or make you feel rushed
                    to make a financial decision.
                  </li>
                  <li>
                    Don&apos;t allow anyone calling you to access your computer
                    or provide them with your bank account details.
                  </li>
                  <li>
                    Make sure you understand what financial access you are
                    giving to a family member or friend by adding them as a
                    signatory to your account.
                  </li>
                </ul>
                <p>
                  Most importantly, if you suspect you are being financially
                  abused, please let us know so we can help you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
