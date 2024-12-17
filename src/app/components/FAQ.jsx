"use client";
import { useState } from "react";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

export default function FAQ() {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const faqData = [
    {
      question: "How does Nodsgy work?",
      answer:
        "Nodsgy uses OpenAI’s GPT-4o mini model to generate subtopics and explanations. It then creates audio using the TTS model from OpenAI.",
    },
    {
      question: "What file types does Nodsgy support?",
      answer: "It supports PDF, pptx, xlsx, odt, odp, and ods file types.",
    },
    {
      question: "How many credits does it take to use Nodsgy each time?",
      answer:
        "It takes 1 credit for every use. Credits can be purchased under the pricing section.",
    },
    {
      question: "How long are the explanations?",
      answer:
        "Each explanation is roughly 1-2 minutes long. The length of each explanation depends upon the content.",
    },
    {
      question: "Do you offer a refund?",
      answer:
        "We do not offer any refunds at this time.",
    },
  ];

  const toggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  return (
    <div className="my-[5rem]" id="faq">
      <div>
        <Image
          src="/faq-title.png"
          width={140}
          height={40}
          className="mx-auto"
          alt="faq-title"
        />
        <h2 className="text-gray font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[100%] w-[90%] mt-6 text-center">
          Here are answers to some common questions
        </h2>
      </div>
      <div className="mx-auto w-max mt-8 shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)] py-3 sm:px-8 px-5 rounded-xl">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`pt-3 pb-3 md:w-[42rem] sm:w-[30rem] w-[20rem] ${
              index !== faqData.length - 1
                ? "border-b-[#e0e0e0] border-b border-solid"
                : ""
            }`}
          >
            <h3
              onClick={() => toggleQuestion(index)}
              className="cursor-pointer font-semibold text-[22px] flex items-center justify-between"
            >
              {item.question}
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  openQuestionIndex === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </h3>
            {openQuestionIndex === index && (
              <p className="mt-2 font-semibold text-[22px] text-gray ">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
